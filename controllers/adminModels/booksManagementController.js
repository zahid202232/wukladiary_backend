const { validationResult } = require('express-validator');
const Coupon = require('../../models/admin/booksModel');
const { upload } = require('../../middlewares/multer');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
//const path = require('path');
//const Coupon = require('../models/Coupon');





const registerBook = async (req, res) => {
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
    const { name, description } = req.body;
    const file = req.file; // multer adds file information to req.file

    // Check if file is present
    if (!file) {
      return res.status(400).json({
        success: false,
        msg: 'File upload failed',
      });
    }

    // Create a new book instance
    const newBook = new Coupon({
      name,
      description,
      file: file.filename // Save the filename (or other file info) to the database
    });

    // Save the book to the database
    const bookData = await newBook.save();

    return res.status(201).json({
      success: true,
      msg: 'Book Registered Successfully!',
      data: bookData,
    });

  } catch (error) {
    console.error('Error registering book:', error.message);
    return res.status(500).json({
      success: false,
      msg: 'Server Error: Unable to register book.',
      error: error.message,
    });
  }
};


const getBooks = async (req, res) => {
  try {
    // Fetch all book data from the database
    const bookData = await Coupon.find();
    
    // Ensure that data is always an array
    if (!Array.isArray(bookData)) {
      throw new Error('Expected an array of book data');
    }
    
    // Return the book data with success status
    return res.status(200).json({
      success: true,
      msg: 'Book data retrieved successfully',
      data: bookData.map(book => ({
        _id: book._id,
        name: book.name,
        description: book.description,
        file: book.file, // Assuming `file` is a string representing the file path or filename
      })),
    });
    
  } catch (error) {
    // Handle errors and send a failure response
    return res.status(500).json({
      success: false,
      msg: 'Error retrieving book data: ' + error.message,
      data: [] // Ensure data is an empty array on error
    });
  }
};


const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
  
    // Log the ID for debugging
    console.log(id);
  
    // Find and delete the book by ID
    const deletedBook = await Coupon.findByIdAndDelete(id);
  
    // Check if the book was found and deleted
    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        msg: 'Book not found',
      });
    }
  
    // Return success response with deleted book data
    return res.status(200).json({
      success: true,
      msg: 'Book deleted successfully',
      data: deletedBook,
    });
  } catch (error) {
    // Handle errors and send failure response
    return res.status(400).json({
      success: false,
      msg: 'Error deleting book: ' + error.message,
    });
  }
};

  

//Get Plan by ID

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the book data by ID from the database
    const bookData = await Coupon.findById(id);

    if (!bookData) {
      return res.status(404).json({
        success: false,
        msg: 'Book not found',
        data: null,
      });
    }

    // Return the book data with success status
    return res.status(200).json({
      success: true,
      msg: 'Book data retrieved successfully',
      data: {
        _id: bookData._id,
        name: bookData.name,
        description: bookData.description,
        file: bookData.file
      },
    });

  } catch (error) {
    // Handle errors and send a failure response
    return res.status(500).json({
      success: false,
      msg: 'An error occurred while retrieving the book data',
      data: null // Ensure data is null on error
    });
  }
};


const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    let filePath;

    // Find the existing book record by ID
    const oldBook = await Coupon.findById(id);
    if (!oldBook) {
      return res.status(404).json({
        success: false,
        msg: 'Book not found',
      });
    }

    // Check if a new file was uploaded
    if (req.file) {
      filePath = `${req.file.filename}`; // Relative path for storage in public directory

      // Delete the old file if it exists
      if (oldBook.file) {
        const oldFilePath = path.join(__dirname, '../public/Images', oldBook.file);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath); // Delete the old file
        }
      }
    } else {
      // If no new file is uploaded, retain the old file path
      filePath = oldBook.file;
    }

    // Prepare the update object
    const updateFields = {
      name,
      description,
      file: filePath // Update file field with the new or old file path
    };

    // Update the book record
    const updatedBook = await Coupon.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      msg: 'Book updated successfully',
      data: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book:", error);
    return res.status(500).json({
      success: false,
      msg: 'An error occurred while updating the book',
      error: error.message,
    });
  }
};


//module.exports = updateBook;






module.exports = {
  registerBook,
  getBooks,
  deleteBook,
  updateBook,
  getBookById,
}
