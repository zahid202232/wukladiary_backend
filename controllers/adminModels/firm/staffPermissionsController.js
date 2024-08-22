const Permission = require('../../../models/admin/firm/staffPermissionsModel');

const { validationResult } = require('express-validator');


// Add New Permissions API Method

const addPermission = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }

        const { role, permissions } = req.body;

        // Validate required fields
        if (!role || !permissions) {
            return res.status(400).json({
                success: false,
                msg: 'Missing required fields'
            });
        }

        // Log the permissions object to debug
       // console.log('Permissions Object:', permissions);

        // Iterate over permissions object
        for (const module in permissions) {
            if (permissions.hasOwnProperty(module)) {
                const permissionLevels = permissions[module];

                // Log module and permission levels to debug
                // console.log('Module:', module);
                // console.log('Permission Levels:', permissionLevels);

                for (const permission_level of permissionLevels) {
                    // Check if the permission already exists
                    const isExists = await Permission.findOne({
                        permission_name: role,
                        module,
                        permission_level
                    });

                    if (isExists) {
                        return res.status(400).json({
                            success: false,
                            msg: 'This Permission Already Exists!'
                        });
                    }

                    // Create the new permission object
                    const newPermission = new Permission({
                        permission_name: role,
                        module,
                        permission_level,
                        is_default: 0 // Set default value; adjust if needed
                    });

                    // Save the permission
                    await newPermission.save();
                }
            }
        }

        return res.status(200).json({
            success: true,
            msg: 'New Permissions Created Successfully!',
        });
    } 
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
};



// Get Permissions API Method

const getPermission = async (req, res) => {
    try {
        // Fetch all the permissions from the database
        const permissions = await Permission.find({});

        return res.status(200).json({
            success: true,
            msg: 'Permissions data successfully retrieved',
            data: permissions
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
};


// Delete Permissions API Method

const deletePermission = async(req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }

        // Get ID from the Request

        const { id } = req.body;

        await Permission.findByIdAndDelete({ _id: id });

        return res.status(200).json({
            success: true,
            msg: 'Permission Deleted successfully!',
        });
        
    } 
    catch (error) 
    {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }

}

// Update Permissions API Method

const updatePermission = async(req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }

        const { id, permission_name } = req.body;

        const isExists = await Permission.findOne({ _id:id });

        if (!isExists) {
            return res.status(400).json({
                success: false,
                msg: 'The Permission ID you have entered does not exist in the system. Please verify the ID and try again.'
            });
        }

        const isNameAssigned = await Permission.findOne({
            _id: { $ne: id },
            permission_name:{
                $regax: permission_name,
                $option:'i'
            }
        });

        if (isNameAssigned) {
            return res.status(400).json({
                success: false,
                msg: 'Permission name is already assigned. Please choose a different name.'
            });
        }

        var updatePermissionData = {
            permission_name
        }

        if (req.body.default !=null) {
            updatePermissionData.is_default = parseInt(req.body.default);
        }

        const updatedPermission = await Permission.findByIdAndUpdate({ _id:id},{
            $set: updatePermissionData
        }, { new:true });


        return res.status(200).json({
            success: true,
            msg: 'Permission updated successfully.',
            data: updatedPermission
        });
        
    } 
    catch (error) 
    {
        return res.status(400).json({
            success: false,
            msg: 'Oops! Something went wrong. Please check the provided data and try again.',
        });
    }

}


module.exports = {
    addPermission,
    getPermission,
    deletePermission,
    updatePermission
}