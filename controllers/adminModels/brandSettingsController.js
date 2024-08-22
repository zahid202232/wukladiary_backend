const { validationResult } = require('express-validator');
const BrandSetting = require('../../models/admin/brandSettingsModel');
//const { upload } = require('../../middlewares/multer');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
//const path = require('path');
//const Coupon = require('../models/Coupon');




const updateBrandSettings = async (req, res) => {
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
  
      // Destructure request body and files
      const {
        titleText,
        footerText,
        defaultLanguage,
        enableSignUpPage,
        emailVerification,
        enableLandingPage,
        transparentLayout,
        darkLayout,
      } = req.body;
  
      // Files from multer
      const logoDarkFile = req.files['logoDark'] ? req.files['logoDark'][0].filename : null;
      const logoLightFile = req.files['logoLight'] ? req.files['logoLight'][0].filename : null;
      const faviconFile = req.files['favicon'] ? req.files['favicon'][0].filename : null;
  
      // Create or update brand settings
      const brandSettings = await BrandSetting.findOneAndUpdate(
        {},
        {
          titleText,
          footerText,
          defaultLanguage,
          enableSignUpPage,
          emailVerification,
          enableLandingPage,
          transparentLayout,
          darkLayout,
          logoDark: logoDarkFile,
          logoLight: logoLightFile,
          favicon: faviconFile,
        },
        { new: true, upsert: true }
      );
  
      return res.status(200).json({
        success: true,
        msg: 'Brand Settings Updated Successfully!',
        data: brandSettings,
      });
  
    } catch (error) {
      console.error('Error updating brand settings:', error.message);
      return res.status(500).json({
        success: false,
        msg: 'Server Error: Unable to update brand settings.',
        error: error.message,
      });
    }
  };
  

const getBrandSettings = async (req, res) => {
    try {
      // Fetch the brand settings data from the database
      const brandSettingsData = await BrandSetting.findOne(); // Assuming there is only one document for brand settings
      
      // Check if brand settings data is found
      if (!brandSettingsData) {
        return res.status(404).json({
          success: false,
          msg: 'No brand settings data found',
          data: {},
        });
      }
      
      // Return the brand settings data with success status
      return res.status(200).json({
        success: true,
        msg: 'Brand settings data retrieved successfully',
        data: {
          titleText: brandSettingsData.titleText,
          footerText: brandSettingsData.footerText,
          defaultLanguage: brandSettingsData.defaultLanguage,
          enableSignUpPage: brandSettingsData.enableSignUpPage,
          emailVerification: brandSettingsData.emailVerification,
          enableLandingPage: brandSettingsData.enableLandingPage,
          transparentLayout: brandSettingsData.transparentLayout,
          darkLayout: brandSettingsData.darkLayout,
          logoDark: brandSettingsData.logoDark, // Assuming this is a URL or path
          logoLight: brandSettingsData.logoLight, // Assuming this is a URL or path
          favicon: brandSettingsData.favicon, // Assuming this is a URL or path
        },
      });
    } catch (error) {
      // Handle errors and send a failure response
      return res.status(500).json({
        success: false,
        msg: 'Error retrieving brand settings data: ' + error.message,
        data: {}, // Ensure data is an empty object on error
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






module.exports = {
  updateBrandSettings,
  getBrandSettings,
}
