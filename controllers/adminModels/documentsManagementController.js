const { validationResult } = require('express-validator');
const Coupon = require('../../models/admin/documentsModel');
const { upload } = require('../../middlewares/multer');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
//const path = require('path');
//const Coupon = require('../models/Coupon');




const registerDocument = async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          msg: 'Validation Errors',
          errors: errors.array(),
        });
      }
  
      // Destructure request body and file
      const { firmId, name, description } = req.body;
      const file = req.file; // multer adds file information to req.file

      // console.log("Document Data :", firmId);
      // console.log("Document Data :", name);
      // console.log("Document Data :", description);
      // console.log("Document Data :", file);
     // console.log("Document Data : ", req.file);
  
      // Check if file is present
      if (!file) {
        return res.status(400).json({
          success: false,
          msg: 'File upload failed',
        });
      }
  
      // Create a new document instance
      const newDocument = new Coupon({
        firmId,
        name,
        description,
        file: file.filename // Save the filename (or other file info) to the database
      });
  
      // Save the document to the database
      const documentData = await newDocument.save();
  
      return res.status(201).json({
        success: true,
        msg: 'Document Registered Successfully!',
        data: documentData,
      });
  
    } catch (error) {
      console.error('Error registering document:', error.message);
      return res.status(500).json({
        success: false,
        msg: 'Server Error: Unable to register document.',
        error: error.message,
      });
    }
  };


  const getDocuments = async (req, res) => {
    try {
      // Fetch all document data from the database
      const documentData = await Coupon.find();
      
      // Ensure that data is always an array
      if (!Array.isArray(documentData)) {
        throw new Error('Expected an array of document data');
      }
      
      // Return the document data with success status
      return res.status(200).json({
        success: true,
        msg: 'Document data retrieved successfully',
        data: documentData.map(document => ({
          _id: document._id,
          name: document.name,
          description: document.description,
          file: document.file, // Assuming `file` is a string representing the file path or filename
        })),
      });
      
    } catch (error) {
      // Handle errors and send a failure response
      return res.status(500).json({
        success: false,
        msg: 'Error retrieving document data: ' + error.message,
        data: [] // Ensure data is an empty array on error
      });
    }
  };
  


  const deleteDocument = async (req, res) => {
    try {
      const { id } = req.params;
    
      // Log the ID for debugging
      console.log(id);
    
      // Find and delete the document by ID
      const deletedDocument = await Coupon.findByIdAndDelete(id);
    
      // Check if the document was found and deleted
      if (!deletedDocument) {
        return res.status(404).json({
          success: false,
          msg: 'Document not found',
        });
      }
    
      // Return success response with deleted document data
      return res.status(200).json({
        success: true,
        msg: 'Document deleted successfully',
        data: deletedDocument,
      });
    } catch (error) {
      // Handle errors and send failure response
      return res.status(400).json({
        success: false,
        msg: 'Error deleting document: ' + error.message,
      });
    }
  };
  
  

//Get Plan by ID

const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the document data by ID from the database
    const documentData = await Coupon.findById(id);

    if (!documentData) {
      return res.status(404).json({
        success: false,
        msg: 'Document not found',
        data: null,
      });
    }

    // Return the document data with success status
    return res.status(200).json({
      success: true,
      msg: 'Document data retrieved successfully',
      data: {
        _id: documentData._id,
        name: documentData.name,
        description: documentData.description,
        file: documentData.file
      },
    });

  } catch (error) {
    // Handle errors and send a failure response
    return res.status(500).json({
      success: false,
      msg: 'An error occurred while retrieving the document data',
      data: null // Ensure data is null on error
    });
  }
};



const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    let filePath;

    // Find the existing document record by ID
    const oldDocument = await Coupon.findById(id);
    if (!oldDocument) {
      return res.status(404).json({
        success: false,
        msg: 'Document not found',
      });
    }

    // Check if a new file was uploaded
    if (req.file) {
      filePath = `${req.file.filename}`; // Relative path for storage in public directory

      // Delete the old file if it exists
      if (oldDocument.file) {
        const oldFilePath = path.join(__dirname, '../public/Images', oldDocument.file);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath); // Delete the old file
        }
      }
    } else {
      // If no new file is uploaded, retain the old file path
      filePath = oldDocument.file;
    }

    // Prepare the update object
    const updateFields = {
      name,
      description,
      file: filePath // Update file field with the new or old file path
    };

    // Update the document record
    const updatedDocument = await Coupon.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      msg: 'Document updated successfully',
      data: updatedDocument,
    });
  } catch (error) {
    console.error("Error updating document:", error);
    return res.status(500).json({
      success: false,
      msg: 'An error occurred while updating the document',
      error: error.message,
    });
  }
};


//module.exports = updateBook;


const getDocumentByFirmId = async (req, res) => {
  try {
    const { firmId } = req.params;
    console.log("Received firmId:", firmId);

    // Fetch the document data by ID from the database
    const documentData = await Coupon.find({ firmId: firmId });
    console.log("Documents found:", documentData);
    if (!documentData  || documentData.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'Document Data not found',
        data: null,
      });
    }

    // Return the document data with success status
    return res.status(200).json({
      success: true,
      msg: 'Document data retrieved successfully',
      data: documentData
    });

  } catch (error) {
    // Handle errors and send a failure response
    return res.status(500).json({
      success: false,
      msg: 'An error occurred while retrieving the document data',
      data: null // Ensure data is null on error
    });
  }
};




module.exports = {
  registerDocument,
  getDocuments,
  deleteDocument,
  updateDocument,
  getDocumentById,
  getDocumentByFirmId,
}
