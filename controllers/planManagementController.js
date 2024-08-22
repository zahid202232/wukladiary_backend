const { validationResult } = require('express-validator');
const Plan = require('../models/admin/planSchema');

const registerPlan = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: 'Validation Errors',
        errors: errors.array(),
      });
    }

    const {
      name,
      price,
      duration,
      maxUser,
      maxAdvocates,
      storageLimit,
      chatgptEnabled,
      trialEnabled,
      description,
    } = req.body;

    // Check if a plan with the same name already exists
    const existingPlan = await Plan.findOne({ name });

    if (existingPlan) {
      return res.status(200).json({
        success: false,
        msg: 'This plan name already exists!',
      });
    }

    const newPlan = new Plan({
      name,
      price,
      duration,
      maxUser,
      maxAdvocates,
      storageLimit,
      chatgptEnabled: chatgptEnabled || false,
      trialEnabled: trialEnabled || false,
      description,
    });

    const planData = await newPlan.save();

    return res.status(200).json({
      success: true,
      msg: 'Plan Registered Successfully!',
      data: planData,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};


const getPlans = async (req, res) => {
  try {
    // Fetch all plan data from the database
    const planData = await Plan.find();

    // Ensure that data is always an array
    if (!Array.isArray(planData)) {
      throw new Error('Expected an array of plan data');
    }

    // Return the plan data with success status
    return res.status(200).json({
      success: true,
      msg: 'Plan data retrieved successfully',
      data: planData.map(plan => ({
        _id: plan._id,
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        maxUser: plan.maxUser,
        maxAdvocate: plan.maxAdvocates,
        storageLimit: plan.storageLimit,
        enableChatgpt: plan.chatgptEnabled,
        trialEnable: plan.trialEnabled,
        description: plan.description
      })),
    });

  } catch (error) {
    // Handle errors and send a failure response
    return res.status(500).json({
      success: false,
      msg: 'Error retrieving plan data: ' + error.message,
      data: [] // Ensure data is an empty array on error
    });
  }
};


const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const deletedPlan = await Plan.findByIdAndDelete(id); 
    if (!deletedPlan) {
      return res.status(404).json({
        success: false,
        msg: 'Plan not found',
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Plan deleted successfully',
      data: deletedPlan,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

//Get Plan by ID

const getPlanById = async (req, res) => {
  try {
    // Fetch the plan data from the database by ID
    const plan = await Plan.findById(req.params.id);

    // Check if the plan exists
    if (!plan) {
      return res.status(404).json({
        success: false,
        msg: 'Plan not found',
        data: null, // Ensure data is null if plan is not found
      });
    }

    // Return the plan data with success status
    return res.status(200).json({
      success: true,
      msg: 'Plan data retrieved successfully',
      data: {
        _id: plan._id,
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        maxUsers: plan.maxUsers,
        maxAdvocates: plan.maxAdvocates,
        storageLimit: plan.storageLimit,
        chatGptEnabled: plan.chatGptEnabled,
        trial: plan.trial,
        description: plan.description,
      },
    });

  } catch (error) {
    // Handle errors and send a failure response
    return res.status(500).json({
      success: false,
      msg: 'Please give correct ID: ',
      data: null, // Ensure data is null on error
    });
  }
};




//Update API
const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      duration,
      maxUsers,
      maxAdvocates,
      storageLimit,
      chatGptEnabled,
      trial,
      description
    } = req.body;

    // Prepare the update object
    let updateFields = {
      name,
      price,
      duration,
      maxUsers,
      maxAdvocates,
      storageLimit,
      chatGptEnabled,
      trial,
      description
    };

    // Find the plan by ID and update its details
    const updatedPlan = await Plan.findOneAndUpdate(
      { _id: id },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        msg: 'Plan not found',
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Plan updated successfully',
      data: updatedPlan,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};




module.exports = {
    registerPlan,
    getPlans,
    deletePlan,
    updatePlan,
    getPlanById,
} 
