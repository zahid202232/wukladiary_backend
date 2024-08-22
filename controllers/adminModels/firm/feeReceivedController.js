const User = require('../../../models/admin/firm/feeReceivedModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Permission = require('../../../models/permissionModel');
const UserPermission = require('../../../models/userPermissionModel');
//const { sendMail } = require('../helpers/mailer');
//const multer = require('multer');
// Register New User API Method
const registerFeeReceived = async (req, res) => {
    try {
      // Validate the request
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          msg: 'Validation Errors',
          errors: errors.array(),
        });
      }
  
      // Extract the data from the request body
      const { particulars, color, fee, paymentmethod, clientname, date, note } = req.body;
  
      // Create the new expense record
      const feeReceived = new User({
        particulars,
        color,
        fee,
        paymentmethod,
        clientname,
        date,
        note: note || '',  // Assigning default value if note is not provided
      });
  
      // Save the expense record to the database
      const feeReceivedData = await feeReceived.save();
  
      // Respond with success
      return res.status(200).json({
        success: true,
        msg: 'Fee Received Registered Successfully!',
        data: feeReceivedData,
      });
    } catch (error) {
      console.error('Error registering Fee Received:', error);
      return res.status(500).json({
        success: false,
        msg: 'An error occurred while registering the Fee Received.',
      });
    }
  };
  

// Generating the JWT Access Token

const generateAccessToken = async(user) => {
    const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn:"2h" });
    console.log("User is : " , user)
    return token;
}

const getFeeReceived = async (req, res) => {
  try {
    // Fetch all user data from the database
    const feeReceivedData = await User.find();

    // Ensure that data is always an array
    if (!Array.isArray(feeReceivedData)) {
      throw new Error('Expected an array of Expense data');
    }

    // Return the roles data with success status
    return res.status(200).json({
      success: true,
      msg: 'Fee Received Data retrieved successfully',
      data: feeReceivedData, // Return the roles array directly
    });

  } catch (error) {
    // Handle errors and send a failure response
    return res.status(500).json({
      success: false,
      msg: 'Error retrieving Fee Received data: ' + error.message,
      data: [] // Ensure data is an empty array on error
    });
  }
};
  
const deleteFeeReceived = async (req, res) => {
  try {
    const { id } = req.params;
    

    // Find and delete the todo
    const deleteFeeReceived = await User.findByIdAndDelete(id);

    if (!deleteFeeReceived) {
      return res.status(404).json({
        success: false,
        msg: 'Fee Data not found',
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Fee Data deleted successfully',
      data: deleteFeeReceived,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Server error: ' + error.message,
    });
  }
  };


const getFeeReceivedById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the document data by ID from the database
      const feeReceivedData = await User.findById(id);
  
      if (!feeReceivedData) {
        return res.status(404).json({
          success: false,
          msg: 'Fee Data not found',
          data: null,
        });
      }
  
      // Return the document data with success status
      return res.status(200).json({
        success: true,
        msg: 'Fee data retrieved successfully',
        data: feeReceivedData,
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

  
  const updateFeeReceived = async (req, res) => {
    try {
      const { id } = req.params;
      const { particulars, color, fee, paymentmethod, clientname, date, note } = req.body;

      
  
      // Find the existing employee record by ID
      const oldFee = await User.findById(id);
      if (!oldFee) {
        return res.status(404).json({
          success: false,
          msg: 'Fee Data not found',
        });
      }
  
      // Prepare the update object
      const updateFields = {
        particulars, 
        color, 
        fee, 
        paymentmethod, 
        clientname, 
        date, 
        note   
      };

      console.log("Update Fields are:", updateFields);
  
      // Update the employee record
      const updateFeeReceived = await User.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
      );
  
      return res.status(200).json({
        success: true,
        msg: 'Fee Data updated successfully',
        data: updateFeeReceived,
      });
    } catch (error) {
      console.error("Error updating Fee Data:", error);
      return res.status(500).json({
        success: false,
        msg: 'An error occurred while updating the Fee',
        error: error.message,
      });
    }
  };
  

module.exports = {
    registerFeeReceived,
    getFeeReceived,
    deleteFeeReceived,
    getFeeReceivedById,
    updateFeeReceived,
}