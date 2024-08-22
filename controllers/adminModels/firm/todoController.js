const Todo = require('../../../models/admin/firm/todoSchema');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
//const Todo = require('../models/permissionModel');
//const UserPermission = require('../models/userPermissionModel');
//const { sendMail } = require('../helpers/mailer');
// Register New User API Method
const createTodo = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: 'Validation Errors',
        errors: errors.array()
      });
    }

    const {
      books,
      firmId,
      name,
      relatedcase,
      assignedDate,
      dueDate,
      priority,
      comadvmem,
      description,
      advocates
    } = req.body;
    // Convert comadvmem to an array of strings
    const comadvmemArray = Array.isArray(comadvmem) ? comadvmem : [];

    // Convert advocates to an array of strings
    const advocatesArray = Array.isArray(advocates) ? advocates : [];

    // Create a new To-Do item
    const todo = new Todo({
      books,
      firmId,
      name,
      relatedcase,
      assignedDate,
      dueDate,
      priority,
      comadvmem: comadvmemArray,
      description,
      advocates: advocatesArray,
      // If you have file uploads, you might handle it here
    });

    const todoData = await todo.save();
    

    return res.status(201).json({
      success: true,
      msg: 'New To-Do Created Successfully!',
      data: todoData
    });
  } catch (error) {
    console.error("Error creating To-Do:", error);
    return res.status(500).json({
      success: false,
      msg: 'Server Error',
      error: error.message
    });
  }
};
// Generating the JWT Access Token

  

// Login User API Method

// Login User API Method
const getTodos = async (req, res) => {
    try {
        // Fetch all todo data from the database
        const todosData = await Todo.find();

        // Ensure that data is always an array
        if (!Array.isArray(todosData)) {
            throw new Error('Expected an array of todo data');
        }

        // Return the todo data with success status
        return res.status(200).json({
            success: true,
            msg: 'Todos data retrieved successfully',
            data: todosData.map(todo => ({
                _id: todo._id,
                name: todo.name,
                description: todo.description,
                dueDate: todo.dueDate, // Adjust based on your schema
                relatedcase: todo.relatedcase, // Adjust based on your schema
                // Include any other fields you want to return
            })),
        });

    } catch (error) {
        // Handle errors and send a failure response
        return res.status(500).json({
            success: false,
            msg: 'Error retrieving todos data: ' + error.message,
            data: [] // Ensure data is an empty array on error
        });
    }
};

  
  const deleteTodo = async (req, res) => {
    try {
      const { id } = req.params;
    
  
      // Find and delete the todo
      const deletedTodo = await Todo.findByIdAndDelete(id);
  
      if (!deletedTodo) {
        return res.status(404).json({
          success: false,
          msg: 'Todo not found',
        });
      }
  
      return res.status(200).json({
        success: true,
        msg: 'Todo deleted successfully',
        data: deletedTodo,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: 'Server error: ' + error.message,
      });
    }
  };

  const updateTodo = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
  
      // Since comadvmem is an array of strings, no need to convert to ObjectId
      // Ensure that updateData.comadvmem is an array of strings
      if (updateData.comadvmem && !Array.isArray(updateData.comadvmem)) {
        return res.status(400).json({
          success: false,
          msg: 'Invalid format for comadvmem',
        });
      }
  
      // Find and update the todo
      const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedTodo) {
        return res.status(404).json({
          success: false,
          msg: 'Todo not found',
        });
      }
  
      return res.status(200).json({
        success: true,
        msg: 'Todo updated successfully',
        data: updatedTodo,
      });
    } catch (error) {
      console.error("Error updating todo:", error);
      return res.status(500).json({
        success: false,
        msg: 'Server error: ' + error.message,
      });
    }
  };
  
  

  const getTodoByFirmId = async (req, res) => {
    try {
      const { firmId } = req.params;
  
      const todoFound = await Todo.find({ firmId: firmId });

  
      if (!todoFound || todoFound.length === 0) {
        return res.status(404).json({
          success: false,
          msg: 'Todo Data not found',
          data: null,
        });
      }
  
      // Return the cases data with success status
      return res.status(200).json({
        success: true,
        msg: 'Todo data retrieved successfully',
        data: todoFound,
      });
  
    } catch (error) {
      console.error("Error while retrieving Todo data:", error);
      return res.status(500).json({
        success: false,
        msg: 'An error occurred while retrieving the Todo data',
        data: null, // Ensure data is null on error
      });
    }
  };

  const getTodoByTodaysDate = async (req, res) => {
    try {
      const { firmId } = req.params;
  
      // Get the start and end of the current day
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
  
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
  
      // Find todos with the dueDate within the current day
      const todoFound = await Todo.find({
        firmId: firmId,
        dueDate: {
          $gte: startOfToday,
          $lte: endOfToday
        }
      });
  
      if (!todoFound || todoFound.length === 0) {
        return res.status(404).json({
          success: false,
          msg: 'No Todo data found for today',
          data: null,
        });
      }
  
      // Return the todos data with success status
      return res.status(200).json({
        success: true,
        msg: 'Todo data for today retrieved successfully',
        data: todoFound,
      });
  
    } catch (error) {
      console.error("Error while retrieving Todo data:", error);
      return res.status(500).json({
        success: false,
        msg: 'An error occurred while retrieving the Todo data',
        data: null,
      });
    }
  };

  const getTodoByUpcomingDate = async (req, res) => {
    try {
      const { firmId } = req.params;
  
      // Get the end of the current day (today)
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
  
      // Find todos with the dueDate after the end of today
      const todoFound = await Todo.find({
        firmId: firmId,
        dueDate: {
          $gt: endOfToday, // Upcoming dates, not today
        },
      }).sort({ dueDate: 1 }); // Optional: sort by dueDate ascending
  
      if (!todoFound || todoFound.length === 0) {
        return res.status(404).json({
          success: false,
          msg: 'No Todo data found for upcoming dates',
          data: null,
        });
      }
  
      // Return the todos data with success status
      return res.status(200).json({
        success: true,
        msg: 'Todo data for upcoming dates retrieved successfully',
        data: todoFound,
      });
  
    } catch (error) {
      console.error("Error while retrieving Todo data:", error);
      return res.status(500).json({
        success: false,
        msg: 'An error occurred while retrieving the Todo data',
        data: null,
      });
    }
  };
  
  

  const getTodoById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the document data by ID from the database
      const todoData = await Todo.findById(id);

     
  
      if (!todoData) {
        return res.status(404).json({
          success: false,
          msg: 'Todo not found',
          data: null,
        });
      }
  
      // Return the document data with success status
      return res.status(200).json({
        success: true,
        msg: 'Todo data retrieved successfully',
        data: todoData,
      });
     
  
    } catch (error) {
      // Handle errors and send a failure response
      return res.status(500).json({
        success: false,
        msg: 'An error occurred while retrieving the Advocate data',
        data: null // Ensure data is null on error
      });
    }
  
  }
  

module.exports = {
    createTodo,
    getTodos,
    deleteTodo,
    updateTodo,
    getTodoByFirmId,
    getTodoById,
    getTodoByTodaysDate,
    getTodoByUpcomingDate,
}