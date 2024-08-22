const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Permission = require('../models/permissionModel');
const UserPermission = require('../models/userPermissionModel');
const { updateUser } = require('./userController');
//const { sendMail } = require('../helpers/mailer');
//const User = require('../models/userModel');

//const { validationResult } = require('express-validator');

//const bcrypt = require('bcrypt');
//const randomstring = require('randomstring');

const { sendMail } = require('../helpers/mailer');
// Register New User API Method
const registerUser = async(req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }
        
        const { name, email, password } = req.body;

        const isExistUser = await User.findOne({ email })

        if (isExistUser) {
            return res.status(200).json({
                success: false,
                msg: 'This E-mail is Already Exist!'
            });
        }

        //password = randomstring.generate(8);
        const hashedPassword = await bcrypt.hash(password, 10);
        
        var obj = {
            name,
            email,
            password: hashedPassword
        }

        if (req.body.role && req.body.role == 1) {

            return res.status(400).json({
                success: false,
                msg: 'Creating admin users is not allowed.'
            });

        }
        else if(req.body.role){
            obj.role = req.body.role;
        }

        const newUser = new User( obj );

        const userData = await newUser.save();

        console.log(password);

        const content = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <p style="font-size: 18px;">Hello ${userData.name},</p>
                
                <p style="font-size: 16px;">Welcome to Einnovention Technologies! Your registration was successful, and your account is now active.</p>

                <p style="font-size: 16px;">Here are your login details:</p>
                
                <ul style="list-style: none; padding: 0; font-size: 16px;">
                    <li><strong>Email:</strong> ${userData.email}</li>
                    <li><strong>Password:</strong> ${password}</li>
                </ul>

                <p style="font-size: 16px;">Keep this information secure and do not share it with anyone. If you have any questions or need assistance, feel free to contact our support team at <a href="mailto:support@example.com" style="color: #007BFF; text-decoration: none;">support@example.com</a>.</p>

                <p style="font-size: 16px;">Thank you for choosing Einnovention Developer Firm! We look forward to serving you.</p>

                <p style="font-size: 16px;">Best regards,<br>
                Einnovention Team</p>
            </div>
        `;

        sendMail(userData.email, 'Your registration was successful, and your account is now active.', content);

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
    const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn:"5m" });
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


const updateProfile = async(req, res) => {

    try {
        const { id } = req.params.id;
        const { name, email, password } = req.body;
        console.log(name)
        console.log(email)
        console.log(password)
        
    
        // Find the user by ID and update their profile
        const updatedUser = await User.findOneAndUpdate(
          id,
          { name, email, password },
          { new: true, runValidators: true }
        );
        if (!updatedUser) {
          return res.status(404).json({
            success: false,
            msg: 'User not found',
          });
        }
        //console.log(updateUser)
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
}


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

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
}