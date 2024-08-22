const { validationResult } = require('express-validator');
const Cause = require('../../../models/admin/firm/causeListSchema');

const registerCause = async (req, res) => {
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

    // Destructure request body
    const {
      tribunal,
      HighCourt,
      circuit,
      causelist,
      causeDetail,
    } = req.body;

    // Check if a cause with the same criteria already exists
    const existingCause = await Cause.findOne({
      tribunal,
      HighCourt,
      circuit,
      causelist,
      causeDetail,
    });

    if (existingCause) {
      return res.status(400).json({
        success: false,
        msg: 'A cause with these details already exists!',
      });
    }

    // Create a new cause instance
    const newCause = new Cause({
      tribunal,
      HighCourt: HighCourt || undefined,
      circuit: circuit || undefined, // Set to undefined if not provided
      causelist,
      causeDetail,
    });

    // Save the cause to the database
    const causeData = await newCause.save();

    return res.status(201).json({
      success: true,
      msg: 'Cause Registered Successfully!',
      data: causeData,
    });

  } catch (error) {
    console.error('Error registering cause:', error.message);
    return res.status(500).json({
      success: false,
      msg: 'Server Error: Unable to register cause.',
      error: error.message,
    });
  }
};



const getCauseList = async (req, res) => {
  try {
    // Fetch all cause data from the database
    const causeData = await Cause.find();

    // Ensure that data is always an array
    if (!Array.isArray(causeData)) {
      throw new Error('Expected an array of cause data');
    }

    // Return the cause data with success status
    return res.status(200).json({
      success: true,
      msg: 'Cause data retrieved successfully',
      data: causeData.map(cause => ({
        _id: cause._id,
        tribunal: cause.tribunal,
        HighCourt: cause.HighCourt,
        circuit: cause.circuit,
        causelist: cause.causelist,
        causeDetail: cause.causeDetail,
      })),
    });

  } catch (error) {
    // Handle errors and send a failure response
    return res.status(500).json({
      success: false,
      msg: 'Error retrieving cause data: ' + error.message,
      data: [] // Ensure data is an empty array on error
    });
  }
};


const deleteCauseList = async (req, res) => {
  try {
    const { id } = req.params;

    // Log the ID for debugging
    console.log(id);

    // Find and delete the cause list by ID
    const deletedCauseList = await Cause.findByIdAndDelete(id);

    // Check if the cause list was found and deleted
    if (!deletedCauseList) {
      return res.status(404).json({
        success: false,
        msg: 'Cause list not found',
      });
    }

    // Return success response with deleted cause list data
    return res.status(200).json({
      success: true,
      msg: 'Cause list deleted successfully',
      data: deletedCauseList,
    });
  } catch (error) {
    // Handle errors and send failure response
    return res.status(400).json({
      success: false,
      msg: 'Error deleting cause list: ' + error.message,
    });
  }
};


module.exports = {
    registerCause,
    getCauseList,
    deleteCauseList,
}
