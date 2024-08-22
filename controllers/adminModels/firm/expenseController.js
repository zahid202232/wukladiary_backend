const User = require('../../../models/admin/firm/expenseModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Permission = require('../../../models/permissionModel');
const UserPermission = require('../../../models/userPermissionModel');
//const { sendMail } = require('../helpers/mailer');
const multer = require('multer');
// Register New User API Method
const registerExpense = async (req, res) => {
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
      const { case: caseValue, date, particulars, moneySpent, paymentMethod, advocateMember, notes } = req.body;
  
      // Create the new expense record
      const expense = new User({
        case: caseValue,
        date,
        particulars,
        moneySpent,
        paymentMethod,
        advocateMember,
        notes: notes || '',  // Assigning default value if notes is not provided
      });
  
      // Save the expense record to the database
      const expenseData = await expense.save();
  
      // Respond with success
      return res.status(200).json({
        success: true,
        msg: 'Expense Registered Successfully!',
        data: expenseData,
      });
    } catch (error) {
      console.error('Error registering expense:', error);
      return res.status(500).json({
        success: false,
        msg: 'An error occurred while registering the expense.',
      });
    }
  };
  

// Generating the JWT Access Token

const generateAccessToken = async(user) => {
    const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn:"2h" });
    console.log("User is : " , user)
    return token;
}

const getExpense = async (req, res) => {
  try {
    // Fetch all user data from the database
    const expenseData = await User.find();

    // Ensure that data is always an array
    if (!Array.isArray(expenseData)) {
      throw new Error('Expected an array of Expense data');
    }

    // Return the roles data with success status
    return res.status(200).json({
      success: true,
      msg: 'Expense Data retrieved successfully',
      data: expenseData, // Return the roles array directly
    });

  } catch (error) {
    // Handle errors and send a failure response
    return res.status(500).json({
      success: false,
      msg: 'Error retrieving Expense data: ' + error.message,
      data: [] // Ensure data is an empty array on error
    });
  }
};
  
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    

    // Find and delete the todo
    const deleteExpense = await User.findByIdAndDelete(id);

    if (!deleteExpense) {
      return res.status(404).json({
        success: false,
        msg: 'Expense not found',
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Expense deleted successfully',
      data: deleteExpense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Server error: ' + error.message,
    });
  }
  };


const getExpenseById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the document data by ID from the database
      const expenseData = await User.findById(id);
  
      if (!expenseData) {
        return res.status(404).json({
          success: false,
          msg: 'Expense not found',
          data: null,
        });
      }
  
      // Return the document data with success status
      return res.status(200).json({
        success: true,
        msg: 'Expense data retrieved successfully',
        data: expenseData,
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

  
  const updateExpense = async (req, res) => {
    try {
      const { id } = req.params;
      const { case: caseValue, date, particulars, moneySpent, paymentMethod, advocateMember, notes } = req.body;
      
  
      // Find the existing employee record by ID
      const oldExpense = await User.findById(id);
      if (!oldExpense) {
        return res.status(404).json({
          success: false,
          msg: 'Expense not found',
        });
      }
  
      // Prepare the update object
      const updateFields = {
        case: caseValue, 
        date, 
        particulars, 
        moneySpent, 
        paymentMethod, 
        advocateMember, 
        notes      
      };

      console.log("Update Fields are:", updateFields);
  
      // Update the employee record
      const updateExpense = await User.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
      );
  
      return res.status(200).json({
        success: true,
        msg: 'Expense updated successfully',
        data: updateExpense,
      });
    } catch (error) {
      console.error("Error updating Expense:", error);
      return res.status(500).json({
        success: false,
        msg: 'An error occurred while updating the Expense',
        error: error.message,
      });
    }
  };
  

module.exports = {
    registerExpense,
    getExpense,
    deleteExpense,
    getExpenseById,
    updateExpense,
}