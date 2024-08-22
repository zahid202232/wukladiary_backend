const { validationResult } = require('express-validator');
const Coupon = require('../models/admin/couponSchema');

const registerCoupon = async (req, res) => {
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
        name,
        discount,
        limit,
        autoCode,
      } = req.body;
  
      // Check if a coupon with the same name or code already exists
      const existingCoupon = await Coupon.findOne({ name }) || await Coupon.findOne({ autoCode });
  
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          msg: 'A coupon with this name or code already exists!',
        });
      }
  
      // Create a new coupon instance
      const newCoupon = new Coupon({
        name,
        discount,
        limit,
        autoCode,
      });
  
      // Save the coupon to the database
      const couponData = await newCoupon.save();
  
      return res.status(201).json({
        success: true,
        msg: 'Coupon Registered Successfully!',
        data: couponData,
      });
  
    } catch (error) {
      console.error('Error registering coupon:', error.message);
      return res.status(500).json({
        success: false,
        msg: 'Server Error: Unable to register coupon.',
        error: error.message,
      });
    }
  };


const getCoupon = async (req, res) => {
    try {
      // Fetch all coupon data from the database
      const couponData = await Coupon.find();
  
      // Ensure that data is always an array
      if (!Array.isArray(couponData)) {
        throw new Error('Expected an array of coupon data');
      }
  
      // Return the coupon data with success status
      return res.status(200).json({
        success: true,
        msg: 'Coupon data retrieved successfully',
        data: couponData.map(coupon => ({
          _id: coupon._id,
          name: coupon.name,
          code: coupon.code,
          discount: coupon.discount,
          limit: coupon.limit,
          autoCode: coupon.autoCode,
          used: coupon.used,
        })),
      });
  
    } catch (error) {
      // Handle errors and send a failure response
      return res.status(500).json({
        success: false,
        msg: 'Error retrieving coupon data: ' + error.message,
        data: [] // Ensure data is an empty array on error
      });
    }
  };
  


  const deleteCoupon = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Log the ID for debugging
      console.log(id);
  
      // Find and delete the coupon by ID
      const deletedCoupon = await Coupon.findByIdAndDelete(id);
  
      // Check if the coupon was found and deleted
      if (!deletedCoupon) {
        return res.status(404).json({
          success: false,
          msg: 'Coupon not found',
        });
      }
  
      // Return success response with deleted coupon data
      return res.status(200).json({
        success: true,
        msg: 'Coupon deleted successfully',
        data: deletedCoupon,
      });
    } catch (error) {
      // Handle errors and send failure response
      return res.status(400).json({
        success: false,
        msg: 'Error deleting coupon: ' + error.message,
      });
    }
  };
  

//Get Plan by ID

const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the coupon data by ID from the database
    const couponData = await Coupon.findById(id);

    if (!couponData) {
      return res.status(404).json({
        success: false,
        msg: 'Coupon not found',
        data: null,
      });
    }

    // Return the coupon data with success status
    return res.status(200).json({
      success: true,
      msg: 'Coupon data retrieved successfully',
      data: {
        _id: couponData._id,
        name: couponData.name,
        discount: couponData.discount,
        limit: couponData.limit,
        autoCode: couponData.autoCode
      },
    });

  } catch (error) {
    // Handle errors and send a failure response
    return res.status(500).json({
      success: false,
      msg: 'Please Pass Correct ID: ',
      data: null // Ensure data is null on error
    });
  }
};




//Update API
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      discount,
      limit,
      autoCode
    } = req.body;

    // Prepare the update object
    let updateFields = {
      name,
      discount,
      limit,
      autoCode
    };

    // Find the coupon by ID and update its details
    const updatedCoupon = await Coupon.findOneAndUpdate(
      { _id: id },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({
        success: false,
        msg: 'Coupon not found',
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Coupon updated successfully',
      data: updatedCoupon,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};




module.exports = {
    registerCoupon,
    getCoupon,
    deleteCoupon,
    updateCoupon,
    getCouponById,
}
