const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
//const checkAuth = require('../middlewares/checkAuthMiddleware');
const authController = require("../controllers/adminController");
const firmController = require("../controllers/firmController");
const  {OnlyAdminCanAccess}  = require("../middlewares/adminMiddleware");
const { registerValidator, loginValidator } = require("../helpers/validator");
const {
  firmRegisterValidator,
  firmLoginValidator,
} = require("../helpers/firmValidator");
const planManagementController = require("../controllers/planManagementController");
const userRegistrationController = require('../controllers/userRegistrationController');
const couponManagementController = require("../controllers/couponManagementController");

const { planRegisterValidator } = require("../helpers/planValidator");
const { couponRegisterValidator } = require("../helpers/couponValidator");
const { booksRegisterValidator } = require("../helpers/booksValidator");
const { documentsRegisterValidator } = require("../helpers/documentsValidator");
const { brandSettingsValidator } = require("../helpers/brandSettingsValidator");
//const auth = require('../middlewares/authMiddleware');
const booksManagementController = require("../controllers/adminModels/booksManagementController");
const documentManagementController = require("../controllers/adminModels/documentsManagementController");
const brandSettingsController = require("../controllers/adminModels/brandSettingsController");
const upload = require("../middlewares/multer");
const uploadBrandSettings = require("../middlewares/multerBrandSettings");

//Register and Login
router.post("/superAdmin/register", registerValidator, authController.registerAdmin);
router.post("/superAdmin/login", loginValidator, authController.loginAdmin);
router.get("/superAdmin/getSuperAdminRecordById/:id", authController.getAdminById);
router.get("/superAdmin/getSuperAdminRecord", authController.getAdmin);


//Plans
router.post(
  "/superAdmin/add-plan", auth, OnlyAdminCanAccess,
  planRegisterValidator,
  planManagementController.registerPlan
);
router.get("/superAdmin/get-plan", auth,  planManagementController.getPlans);
router.delete(
  "/superAdmin/deletePlan/:id", auth, 
  planManagementController.deletePlan
);
router.patch(
  "/superAdmin/updatePlan/:id", auth, 
  planManagementController.updatePlan
);
router.get(
  "/superAdmin/getPlan/:id", auth, 
  planManagementController.getPlanById
);


//Users
router.post('/registerUser', auth, OnlyAdminCanAccess, userRegistrationController.registerUser);
router.post('/loginUser',auth, OnlyAdminCanAccess, userRegistrationController.loginUser);
router.get('/userProfile', auth, OnlyAdminCanAccess, userRegistrationController.getProfile);
router.get('/userProfile/:id', auth, OnlyAdminCanAccess, userRegistrationController.getSingleProfile);
router.patch('/updateProfile/:id', auth, OnlyAdminCanAccess, userRegistrationController.updateProfile);
router.delete('/deleteProfile/:id', auth, OnlyAdminCanAccess, userRegistrationController.deleteProfile);
router.get('/getUserById/:id', auth, OnlyAdminCanAccess,  userRegistrationController.getUserById);


//Coupons
router.post(
  "/superAdmin/add-coupon", auth, 
  couponRegisterValidator,
  couponManagementController.registerCoupon
);
router.get(
  "/superAdmin/get-coupon", auth, 
  couponRegisterValidator,
  couponManagementController.getCoupon
);
router.delete(
  "/superAdmin/deleteCoupon/:id",  auth, 
  couponManagementController.deleteCoupon
);
router.patch(
  "/superAdmin/updateCoupon/:id",  auth, 
  couponManagementController.updateCoupon
);
router.get(
  "/superAdmin/getCouponById/:id", auth, 
  couponManagementController.getCouponById
);

//Books
router.post(
  "/superAdmin/add-books", auth, 
  upload,
  booksRegisterValidator,
  booksManagementController.registerBook
);
router.get(
  "/superAdmin/get-books",  auth, 
  booksRegisterValidator,
  booksManagementController.getBooks
);
router.delete(
  "/superAdmin/deleteBook/:id",  auth, 
  booksManagementController.deleteBook
);
router.patch(
  "/superAdmin/updateBook/:id", auth, 
  upload,
  booksManagementController.updateBook
);
router.get(
  "/superAdmin/getBookById/:id",  auth, 
  booksManagementController.getBookById
);

//Documents
router.post("/superAdmin/add-documents", auth, upload, documentsRegisterValidator, documentManagementController.registerDocument);
router.get(
  "/superAdmin/get-document", auth, 
  booksRegisterValidator,
  documentManagementController.getDocuments
);
router.delete(
  "/superAdmin/deleteDocument/:id",  auth, 
  documentManagementController.deleteDocument
);
router.patch(
  "/superAdmin/updateDocument/:id", auth, 
  upload,
  documentManagementController.updateDocument
);
router.get(
  "/superAdmin/getDocumentById/:id", auth, 
  documentManagementController.getDocumentById
);
router.get(
  "/superAdmin/getDocumentByFirmId/:firmId", auth, 
  documentManagementController.getDocumentByFirmId
);

//Brand Settings
//router.post('/superAdmin/add-documents', auth, upload, brandSettingsValidator, documentManagementController.registerDocument);
router.get(
  "/superAdmin/getBrandSettings",  auth, 
  brandSettingsValidator,
  brandSettingsController.getBrandSettings
);
router.delete(
  "/superAdmin/deleteDocument/:id",  auth, 
  documentManagementController.deleteDocument
);
router.patch(
  "/superAdmin/updateBrandSettings",  auth, 
  uploadBrandSettings.fields([
    { name: "logoDark", maxCount: 1 },
    { name: "logoLight", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  brandSettingsValidator,
  brandSettingsController.updateBrandSettings
);
//router.get('/superAdmin/getDocumentById/:id', auth, documentManagementController.getDocumentById);

// Related to Firm Routes
//router.get('/admin/getFirm', authController.getAdmin);

router.post(
  "/firm/register",
  firmRegisterValidator,
  firmController.registerFirm
);
router.post("/firm/login", firmLoginValidator, firmController.loginFirm);
router.get("/firm/loginbyId/:id", auth,  firmLoginValidator, firmController.loginFirmById);
router.delete("/deleteFirm/:id", auth, OnlyAdminCanAccess,   firmController.deleteFirm);
router.patch("/updateFirm/:id", auth, OnlyAdminCanAccess,   firmController.updateFirm);
router.get("/firm/getFirm", auth, OnlyAdminCanAccess,  firmController.getFirm);
router.get("/firm/getFirmById/:id", firmController.getFirmById);
router.patch("/firm/updatePassword/:id", auth,  firmController.updatePassword);
router.patch("/firm/toogleLoginStatus/:id", auth,  firmController.toggleLoginStatus);
module.exports = router;
