const User = require('../models/userRegister');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Permission = require('../models/permissionModel');
const UserPermission = require('../models/userPermissionModel');
const { updateUser } = require('./userController');
// Register New User API Method
const registerUser = async(req, res) => {

    try {
// dd(req);     
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }
        
        const { name, email, password} = req.body;

        const isExistUser = await User.findOne({ email })

        if (isExistUser) {
            return res.status(200).json({
                success: false,
                msg: 'This E-mail is Already Exist!'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 15);

        const user = new User({
            name,
            email,
            password:hashedPassword
        });

        const userData = await user.save();

        // Assigning the Default Permissions to created User

        const defaultPermissions = await Permission.find({
            is_default: 1
        });

        if (defaultPermissions.length > 0) {

            const PermissionArray = [];

            defaultPermissions.forEach(permission => {

                PermissionArray.push({
                    permission_name:permission.permission_name,
                    permission_value:[0,1,2,3]
                });

            });
            const userPermission = new UserPermission({
                user_id:userData._id,
                permissions:PermissionArray
            });
            
            await userPermission.save();
            
        }
        
      //  dd(userPermission);
        return res.status(200).json({
            success: true,
            msg: 'User Registered Successfully!',
            data: userData
        });
        
    } 
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }

}

const getUserById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the document data by ID from the database
      const userById = await User.findById(id);
  
      if (!userById) {
        return res.status(404).json({
          success: false,
          msg: 'User Data not found',
          data: null,
        });
      }
  
      // Return the document data with success status
      return res.status(200).json({
        success: true,
        msg: 'User data retrieved successfully',
        data: userById,
      });
  
    } catch (error) {
      // Handle errors and send a failure response
      return res.status(500).json({
        success: false,
        msg: 'An error occurred while retrieving the User data',
        data: null // Ensure data is null on error
      });
    }
};


// Generating the JWT Access Token

const generateAccessToken = async(user) => {
    const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn:"2h" });
    return token;
}


// Login User API Method

const loginUser = async(req, res) => {  

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
//Update User Profile Method Api



const updateProfile = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password, permissions } = req.body;
  
      // Prepare the update object
      let updateFields = { name, email, permissions };
      
      // If a password is provided, hash it before updating
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.password = hashedPassword;
      }
      
      // Find the user by ID and update their profile
      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        updateFields,
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
        msg: 'Profile updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: error.message,
      });
    }
  };
  



// Get User Profile Method API


const getProfile = async(req, res) => {

    try {
        const userData = await User.find();

        return res.status(200).json({
            success: true,
            msg: 'Profile data retrieved successfully',
            data: userData,
        });
        
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }

}

const getSingleProfile = async(req, res) => {

    try {
        const userData = await User.findOne();

        return res.status(200).json({
            success: true,
            msg: 'Profile data retrieved successfully',
            data: userData,
        });
        
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }

}

const deleteProfile = async (req, res) => {
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

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    getSingleProfile,
    updateProfile,
    deleteProfile,
    getUserById,
}