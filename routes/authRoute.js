const express = require('express');
const router = express();
const auth = require('../middlewares/authMiddleware'); 
const authController = require('../controllers/authController');
const userRegistrationController = require('../controllers/userRegistrationController');
const { registerValidator, loginValidator } = require('../helpers/validator');
const userController = require('../controllers/userController');
// router.post('/registerUser', userRegistrationController.registerUser);
// router.post('/loginUser', userRegistrationController.loginUser);
// router.get('/userProfile',  userRegistrationController.getProfile);
// router.get('/userProfile/:id',  userRegistrationController.getSingleProfile);
// router.patch('/updateProfile/:id',  userRegistrationController.updateProfile);
// router.delete('/deleteProfile/:id',  userRegistrationController.deleteProfile);

router.post('/register',  registerValidator, authController.registerUser);
router.post('/login', loginValidator, authController.loginUser);
router.get('/profile',  authController.getProfile);
module.exports = router;
