const User = require('../models/admin/firmModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Permission = require('../models/permissionModel');
const UserPermission = require('../models/userPermissionModel');
// Register New User API Method
let currentSerialNumber = 0; // Initialize with 0 or retrieve the latest number from the database if needed

const getNextSerialNumber = async () => {
  try {
    // Fetch the firm with the highest serial number
    const lastFirm = await User.findOne().sort({ serialNumber: -1 }).select('serialNumber');
    console.log("Last Firm with Highest Serial Number:", lastFirm);
    
    // Determine the next serial number
    const lastSerialNumber = lastFirm ? parseInt(lastFirm.serialNumber, 10) : 0;
    console.log("Last Serial Number:", lastSerialNumber);

    const nextSerialNumber = (lastSerialNumber + 1).toString().padStart(5, '0'); // Increment and pad with leading zeros
    console.log("Next Serial Number:", nextSerialNumber);

    return nextSerialNumber;
  } catch (error) {
    console.error('Error fetching the next serial number:', error);
    throw new Error('Error determining the next serial number');
  }
};

const registerFirm = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: 'Errors',
        errors: errors.array()
      });
    }

    const { name, email, userName, phone, password, dueDate } = req.body;

    // Check if the user already exists
    const isExistUser = await User.findOne({ email });

    if (isExistUser) {
      return res.status(200).json({
        success: false,
        msg: 'This E-mail already exists!'
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 15);

    // Get the next serial number
    const nextSerialNumber = await getNextSerialNumber();

    // Create the new firm
    const firm = new User({
      name,
      email,
      userName,
      phone,
      password: hashedPassword,
      dueDate: dueDate || Date.now(),
      serialNumber: nextSerialNumber
    });

    // Save the firm to the database
    const firmData = await firm.save();

    // Assigning default permissions
    const defaultPermissions = await Permission.find({ is_default: 2 });

    if (defaultPermissions.length > 0) {
      const permissionArray = defaultPermissions.map(permission => ({
        permission_name: permission.permission_name,
        permission_value: [0, 1, 2, 3]
      }));

      const firmPermission = new UserPermission({
        user_id: firmData._id,
        permissions: permissionArray
      });

      await firmPermission.save();
    }

    return res.status(200).json({
      success: true,
      msg: 'Firm Registered Successfully!',
      data: firmData
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message
    });
  }
};


// Generating the JWT Access Token

const generateAccessToken = async(user) => {
  const payload = {
    _id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    password: user.password,
    role: user.role,
    __v: user.__v,
  };
  //console.log("Payload : " ,payload)
  const token = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, { expiresIn:"2h" });
  return token;
  }


// Login User API Method

const loginFirm = async(req, res) => {  

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(400).json({
                success: false,
                msg: 'E-mail or Password does not match!'
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, userData.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                msg: 'E-mail or Password does not match!'
            });
        }

        const accessToken = await generateAccessToken({ user: userData });

        // Fetch User Data with all the assigned permissions

        const result = await User.aggregate([
            {
                $match:{ email:userData.email }
            },
            {
                $lookup:{
                    from:"userpermissions",
                    localField: "_id",
                    foreignField: "user_id",
                    as: 'permissions'
                }
            },
            {
                $project:{
                    _id: 1,
                    name: 1,
                    email: 1,
                    role: 1,
                    permissions:{
                        $cond:{
                            if: { $isArray: "$permissions" },
                            then: { $arrayElemAt: [ "$permissions", 0 ] },
                            else: null
                        }
                    }
                }
            },
            {
                $addFields:{
                    "permissions":{
                        "permissions": "$permissions.permissions"
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            msg: 'You have successfully logged in.',
            accessToken: accessToken,
            tokenType:'Bearer Token',
            data: result[0]
        });
        
    } 
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }

}


const loginFirmById = async (req, res) => {  
  try {
   
    // Find the user by firm ID
    const userData = await User.findById(req.params.id);
    console.log("FIRMID", userData)
    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: 'User not found!'
      });
    }

//    const accessToken = await generateAccessToken({ user: userData });

    // Fetch User Data with all the assigned permissions
    const result = await User.aggregate([
      {
        $match: { _id: userData._id }
      },
      {
        $lookup: {
          from: "userpermissions",
          localField: "_id",
          foreignField: "user_id",
          as: 'permissions'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          permissions: {
            $cond: {
              if: { $isArray: "$permissions" },
              then: { $arrayElemAt: [ "$permissions", 0 ] },
              else: null
            }
          }
        }
      },
      {
        $addFields: {
          "permissions.permissions": "$permissions.permissions"
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      msg: 'You have successfully logged in.',
    //  accessToken: accessToken,
    //  tokenType: 'Bearer Token',
      data: result[0]
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message
    });
  }
}


const getFirmById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the book data by ID from the database
    const firmDataById = await User.findById(id);

    if (!firmDataById) {
      return res.status(404).json({
        success: false,
        msg: 'Firm not found',
        data: null,
      });
    }

    // Return the book data with success status
    return res.status(200).json({
      success: true,
      msg: 'Firm data retrieved successfully',
      data: firmDataById,
    });

  } catch (error) {
    // Handle errors and send a failure response
    return res.status(500).json({
      success: false,
      msg: 'An error occurred while retrieving the Firm data',
      data: null // Ensure data is null on error
    });
  }
};


const getFirm = async (req, res) => {
  try {
    // Fetch all firm data from the database
    const firmData = await User.find();

    // Ensure that data is always an array
    if (!Array.isArray(firmData)) {
      throw new Error('Expected an array of firm data');
    }

    // Return the firm data with success status
    return res.status(200).json({
      success: true,
      msg: 'Firm data retrieved successfully',
      data: firmData.map(firm => ({
        _id: firm._id,
        name: firm.name,
        email: firm.email,
        phone: firm.phone,
        address: firm.address,
        city: firm.city,
        state: firm.state,
        zip: firm.zip,
        landmark: firm.landmark,
        dueDate: firm.dueDate ? new Date(firm.dueDate).toLocaleDateString() : "N/A", // Format the dueDate
        serialNumber: firm.serialNumber // Ensure serialNumber is included
      })),
    });

  } catch (error) {
    // Handle errors and send a failure response
    return res.status(500).json({
      success: false,
      msg: 'Error retrieving firm data: ' + error.message,
      data: [] // Ensure data is an empty array on error
    });
  }
};


const deleteFirm = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }
    return res.status(200).json({
      success: true,
      msg: 'Profile deleted successfully',
      data: deletedUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};


const updateFirm = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      mobileNumber,
      address,
      city,
      state,
      zipCode,
      landmark,
      about,
      company_logo,  // Handle company logo separately if necessary
    } = req.body;

    // Prepare the update object
    let updateFields = {
      name,
      email,
      mobileNumber,
      address,
      city,
      state,
      zipCode,
      landmark,
      about,
    };
    
    // Handle company_logo if it's provided
    if (company_logo) {
      // Assuming company_logo is a URL or path to the uploaded file
      updateFields.company_logo = company_logo;
    }
    
    // Find the firm by ID and update their details
    const updatedFirm = await User.findOneAndUpdate(
      { _id: id },
      updateFields,
      { new: true, runValidators: true }
    );
    
    if (!updatedFirm) {
      return res.status(404).json({
        success: false,
        msg: 'Firm not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      msg: 'Firm updated successfully',
      data: updatedFirm,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};


const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, confirmPassword } = req.body;

    console.log("PASSWORD", password)
    console.log("CONFIRM PASSWORD", confirmPassword)

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the user by ID and update their password
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { password: hashedPassword },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Password updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};


const toggleLoginStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isLoginEnabled } = req.body;

    const updatedFirm = await User.findByIdAndUpdate(
      id,
      { isLoginEnabled },
      { new: true, runValidators: true }
    );

    if (!updatedFirm) {
      return res.status(404).json({
        success: false,
        msg: "Firm not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Firm login status updated successfully",
      data: updatedFirm,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};



module.exports = {
    registerFirm,
    loginFirm,
    getFirm,
    deleteFirm,
    updateFirm,
    loginFirmById,
    getFirmById,
    updatePassword,
    toggleLoginStatus,
}