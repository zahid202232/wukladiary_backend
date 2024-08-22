const User = require('../models/adminModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Permission = require('../models/permissionModel');
const UserPermission = require('../models/userPermissionModel');
const { sendMail } = require('../helpers/mailer');
// Register New User API Method
const registerAdmin = async(req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }
        
        const { name, phone, email, password } = req.body;

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
            phone,
            email,
            password:hashedPassword
        });

        const userData = await user.save();
        console.log("User Data is :" + userData)

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

    return res.status(200).json({
        success: true,
        msg: 'New User Created Successfully!',
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

// Generating the JWT Access Token

const generateAccessToken = async(user) => {
    const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn:"2h" });
    console.log("User is : " , user)
    return token;
}

  

// Login User API Method

// Login User API Method
const loginAdmin = async (req, res) => {  
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

        // Find user by email
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({
                success: false,
                msg: 'E-mail or Password does not match!'
            });
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(password, userData.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                msg: 'E-mail or Password does not match!'
            });
        }

        // Generate access token
        const accessToken = await generateAccessToken({ user: userData });
        console.log("accessToken is : " , accessToken)

        res.cookie('token', accessToken, {
            // httpOnly: true, // Helps prevent XSS attacks
            // secure: false, // Set to true in production if using HTTPS
            // sameSite: 'Lax', // Use 'Lax' or 'Strict' for development, 'Strict' might cause issues
            // maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Fetch user data with permissions
        const result = await User.aggregate([
            {
                $match: { email: userData.email }
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
                            then: { $arrayElemAt: ["$permissions", 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $addFields: {
                    "permissions": {
                        "permissions": "$permissions.permissions"
                    }
                }
            }
        ]);

        // Set the token as a cookie
      

        // Return response with token and user data
        return res.status(200).json({
            success: true,
            msg: 'You have successfully logged in.',
            accessToken: accessToken,
            tokenType: 'Bearer Token',
            data: result[0] // Fix to return the first user object from the result
        });
        
    } catch (error) {
        console.error("Login error:", error);
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};







const getAdminById = async (req, res) => {
    try {
    //   // Validate the ID format
    //   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //     return res.status(400).json({
    //       success: false,
    //       msg: 'Invalid ID format',
    //       data: null,
    //     });
    //   }
  
      // Fetch the user data from the database by ID
      const user = await User.findById(req.params.id);
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({
          success: false,
          msg: 'User not found',
          data: null,
        });
      }
  
      // Return the user data with success status
      return res.status(200).json({
        success: true,
        msg: 'User data retrieved successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role, // Include user role
          phone: user.phone, // Example additional field
          // Ensure all necessary fields are included
        },
      });
  
    } catch (error) {
      console.error('Error fetching user data:', error); // Debugging output
      // Handle errors and send a failure response
      return res.status(500).json({
        success: false,
        msg: 'Error retrieving user data: ' + error.message,
        data: null,
      });
    }
  };
  
  const getAdmin = async (req, res) => {
    try {
      // Fetch all user data from the database
      const userData = await User.find();
  
      // Ensure that data is always an array
      if (!Array.isArray(userData)) {
        throw new Error('Expected an array of user data');
      }
  
      // Extract only the role numbers
      const roles = userData.map(user => user.role);
  
      // Return the roles data with success status
      return res.status(200).json({
        success: true,
        msg: 'Roles retrieved successfully',
        data: roles, // Return the roles array directly
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
  

module.exports = {
    registerAdmin,
    loginAdmin,
    getAdminById,
    getAdmin,
}