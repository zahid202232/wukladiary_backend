const express = require('express');
const router = express();
const auth = require('../middlewares/authMiddleware');
const {addPermission,getPermission,deletePermission,updatePermission} = require('../controllers/admin/permissionController');
const roleController = require('../controllers/admin/roleController');
const { OnlyAdminCanAccess } = require('../middlewares/adminMiddleware');
const { permissionAddValidator, permissionDeleteValidator, permissionUpdateValidator, storeRoleValidator } = require('../helpers/adminValidator');

// Authenticated Routes Starts Here (authorization token needed) -----------

// Permissions Routes
 
router.post('/add-permission', OnlyAdminCanAccess, permissionAddValidator, addPermission);
router.get('/get-permissions',  OnlyAdminCanAccess, getPermission);
router.post('/delete-permission',  OnlyAdminCanAccess, permissionDeleteValidator, deletePermission);
router.post('/update-permission',  OnlyAdminCanAccess, permissionUpdateValidator, updatePermission);


// Roles Routes
router.post('/store-role',  OnlyAdminCanAccess, storeRoleValidator, roleController.storeRole);
router.get('/get-roles',  OnlyAdminCanAccess, roleController.getRoles);
module.exports = router;