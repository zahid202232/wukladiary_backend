const User = require('../../../models/admin/firm/employeeModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Permission = require('../../../models/permissionModel');
const UserPermission = require('../../../models/userPermissionModel');
//const { sendMail } = require('../helpers/mailer');
const multer = require('multer');
// Register New User API Method
const registerEmployee = async (req, res) => {
    try {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          msg: 'Validation Errors',
          errors: errors.array(),
        });
      }
  
      const { name, userName, phone, email, password, role, firmIdByLocal } = req.body;
  
      // Check if the employee with the given email already exists
      const isExistEmployee = await User.findOne({ email });
  
      if (isExistEmployee) {
        return res.status(200).json({
          success: false,
          msg: 'This E-mail is Already Exist!',
        });
      }
  
      // Hash the password if provided
      let hashedPassword = '';
      if (password) {
        hashedPassword = await bcrypt.hash(password, 15);
      }
  
      // Create the new employee record
      const employee = new User({
        name,
        userName,
        phone,
        email,
        password: hashedPassword || undefined,
        role,
        firmIdByLocal,
      });
  
      const employeeData = await employee.save();
      console.log("Employee Data is:", employeeData);
  
      // Assigning the default permissions to the created employee
      const defaultPermissions = await Permission.find({
        is_default: 1,
      });
  
      if (defaultPermissions.length > 0) {
        const PermissionArray = [];
  
        defaultPermissions.forEach((permission) => {
          PermissionArray.push({
            permission_name: permission.permission_name,
            permission_value: [0, 1, 2, 3],
          });
        });
  
        const employeePermission = new UserPermission({
          user_id: employeeData._id,
          permissions: PermissionArray,
        });
  
        await employeePermission.save();
      }
  
      return res.status(200).json({
        success: true,
        msg: 'New Employee Created Successfully!',
        data: employeeData,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: error.message,
      });
    }
  };
  

// Generating the JWT Access Token

const generateAccessToken = async(user) => {
    const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn:"2h" });
    console.log("User is : " , user)
    return token;
}

const getEmployee = async (req, res) => {
  try {
    // Fetch all user data from the database
    const userData = await User.find();

    // Ensure that data is always an array
    if (!Array.isArray(userData)) {
      throw new Error('Expected an array of user data');
    }

    // Return the roles data with success status
    return res.status(200).json({
      success: true,
      msg: 'Data retrieved successfully',
      data: userData, // Return the roles array directly
    });

  } catch (error) {
    // Handle errors and send a failure response
    return res.status(500).json({
      success: false,
      msg: 'Error retrieving roles data: ' + error.message,
      data: [] // Ensure data is an empty array on error
    });
  }
};

const getEmployeeByFirmId = async (req, res) => {
  try {
    const { firmIdByLocal } = req.params;
    console.log("Received firmId:", firmIdByLocal);

    const employee = await User.find({ firmIdByLocal: firmIdByLocal });
    console.log("Employee found:", employee);

    if (!employee || employee.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'Employee Data not found',
        data: null,
      });
    }

    // Return the cases data with success status
    return res.status(200).json({
      success: true,
      msg: 'Employee data retrieved successfully',
      data: employee,
    });

  } catch (error) {
    console.error("Error while retrieving case data:", error);
    return res.status(500).json({
      success: false,
      msg: 'An error occurred while retrieving the Case data',
      data: null, // Ensure data is null on error
    });
  }
};
  
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    

    // Find and delete the todo
    const deleteEmployee = await User.findByIdAndDelete(id);

    if (!deleteEmployee) {
      return res.status(404).json({
        success: false,
        msg: 'Employee not found',
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Employee deleted successfully',
      data: deleteEmployee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Server error: ' + error.message,
    });
  }
  };


const getEmployeeById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the document data by ID from the database
      const employeeData = await User.findById(id);
  
      if (!employeeData) {
        return res.status(404).json({
          success: false,
          msg: 'Employee not found',
          data: null,
        });
      }
  
      // Return the document data with success status
      return res.status(200).json({
        success: true,
        msg: 'Employee data retrieved successfully',
        data: employeeData,
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

  
  const updateEmployee = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        landmark,
        about,
      } = req.body;
      let companyLogoPath;
  
      // Find the existing employee record by ID
      const oldEmployee = await User.findById(id);
      if (!oldEmployee) {
        return res.status(404).json({
          success: false,
          msg: 'Employee not found',
        });
      }
  
      // Check if a new company logo file was uploaded
      if (req.file) {
        companyLogoPath = `${req.file.filename}`; // Relative path for storage in public directory
  
        // Delete the old company logo file if it exists
        if (oldEmployee.company_logo) {
          const oldCompanyLogoPath = path.join(__dirname, '../public/Images', oldEmployee.company_logo);
          if (fs.existsSync(oldCompanyLogoPath)) {
            fs.unlinkSync(oldCompanyLogoPath); // Delete the old file
          }
        }
      } else {
        // If no new company logo file is uploaded, retain the old file path
        companyLogoPath = oldEmployee.company_logo;
      }
  
      // Prepare the update object
      const updateFields = {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        landmark,
        about,
        company_logo: companyLogoPath, // Update company_logo field with the new or old file path
      };

      console.log("Update Fields are:", updateFields);
  
      // Update the employee record
      const updatedEmployee = await User.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
      );
  
      return res.status(200).json({
        success: true,
        msg: 'Employee updated successfully',
        data: updatedEmployee,
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      return res.status(500).json({
        success: false,
        msg: 'An error occurred while updating the employee',
        error: error.message,
      });
    }
  };
  

module.exports = {
    registerEmployee,
    getEmployee,
    deleteEmployee,
    getEmployeeById,
    updateEmployee,
    getEmployeeByFirmId,
}