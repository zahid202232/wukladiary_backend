const express = require('express');
const router = express();
const auth = require('../middlewares/authMiddleware'); 

//onlyFirmCanAccess
const {onlyFirmCanAccess} = require("../middlewares/firm/firmMiddleware")

//Multer
const advocateUpload  = require("../middlewares/firm/advocateMulter")
const employeeUpload = require("../middlewares/multer")

//Validators
const {registerCauseValidator} = require("../helpers/firm/causeListValidator")
const {registerAdvocateValidator} = require("../helpers/firm/advocateValidator")
const todoValidator = require("../helpers/firm/todoValidator")
const {registerEmployeeValidator} = require("../helpers/firm/employeeValidator")
const {registerExpenseValidator} = require("../helpers/firm/expenseValidator")
const {feeReceivedValidator} = require("../helpers/firm/feeReceivedValidator")
const {caseValidator} = require("../helpers/firm/caseValidator")
const {clientValidator} = require("../helpers/firm/clientValidator")


//Conrollers
const causeListController = require('../controllers/adminModels/firm/causeListController');
const advocateController = require('../controllers/adminModels/firm/advocateController');
const todoController = require('../controllers/adminModels/firm/todoController');
const staffPermissionsController = require("../controllers/adminModels/firm/staffPermissionsController")
const employeeController = require("../controllers/adminModels/firm/employeeControllrer")
const expenseController = require("../controllers/adminModels/firm/expenseController")
const feeReceivedController = require("../controllers/adminModels/firm/feeReceivedController")
const caseController = require("../controllers/adminModels/firm/caseController")
const clientController = require("../controllers/adminModels/firm/clientController")

//const userController = require('../controllers/userController');
router.post('/firm/registerCause',  registerCauseValidator, causeListController.registerCause);
router.get('/firm/getCauseList',  causeListController.getCauseList);
router.delete('/firm/deleteCauseList/:id',   causeListController.deleteCauseList);

//Advocate
router.post('/firm/registerAdvocate',  advocateUpload, registerAdvocateValidator, advocateController.registerAdvocate);
router.get('/firm/getAdvocates',  advocateController.getAdvocates);
router.delete('/firm/deleteAdovocte/:id',  advocateController.deleteAdvocate);
router.get('/firm/getAdvocateById/:id',  advocateController.getAdvocateById);
router.get('/firm/getAdvocatesByFirmId/:firmIdByLocal',  advocateController.getAdvocatByFirmId);
router.patch('/firm/updateAdvocate/:id', advocateController.updateAdvocate);

//Todo
router.post('/firm/registerTodo',  todoValidator, todoController.createTodo);
router.get('/firm/getTodo',  todoController.getTodos);
router.delete('/firm/deleteTodo/:id',  todoController.deleteTodo);
router.patch('/firm/updateTodo/:id',  todoController.updateTodo);
router.get('/firm/getTodoById/:id',  todoController.getTodoById);
router.get('/firm/getTodoByFirmId/:firmId',  todoController.getTodoByFirmId);
router.get('/firm/getTodoByTodaysDate/:firmId',  todoController.getTodoByTodaysDate);
router.get('/firm/getTodoByUpcomingDate/:firmId',  todoController.getTodoByUpcomingDate);

//Staff
router.post('/firm/addPermissions',  staffPermissionsController.addPermission);
router.get('/firm/getPermissions',  staffPermissionsController.getPermission);

//Roles
router.post('/firm/addPermissions',  staffPermissionsController.addPermission);

//Employee
router.post('/firm/addEmployee',  registerEmployeeValidator, employeeController.registerEmployee);
router.get('/firm/getEmployee',   employeeController.getEmployee);
router.get('/firm/getProfileById/:id',   employeeController.getEmployeeById);
router.delete('/firm/deleteEmployee/:id',   employeeController.deleteEmployee);
router.patch('/firm/updateEmployee/:id',  employeeUpload,  employeeController.updateEmployee);
router.get('/firm/getEmployeeByFirmId/:firmIdByLocal',  employeeUpload,  employeeController.getEmployeeByFirmId);

//Expense
router.post('/firm/registerExpense', registerExpenseValidator, expenseController.registerExpense);
router.get('/firm/getExpense',  expenseController.getExpense);
router.delete('/firm/deleteExpense/:id',   expenseController.deleteExpense);
router.patch('/firm/updateExpense/:id', expenseController.updateExpense);
router.get('/firm/getExpensebyId/:id',   expenseController.getExpenseById);

//FeeReceived
router.post('/firm/registerFeeReceived',  feeReceivedValidator, feeReceivedController.registerFeeReceived);
router.get('/firm/getFeeReceived',  feeReceivedController.getFeeReceived);
router.delete('/firm/deleteFeeReceived/:id',   feeReceivedController.deleteFeeReceived);
router.patch('/firm/updateFeeReceived/:id',  feeReceivedController.updateFeeReceived);
router.get('/firm/getFeeReceivedById/:id',   feeReceivedController.getFeeReceivedById);

//Cases
router.post('/firm/registerCase', caseValidator, caseController.registerCase);
router.get('/firm/getCase', caseController.getCase);
router.delete('/firm/deleteCase/:id',  caseController.deleteCase);
router.patch('/firm/updateCase/:id',  caseController.updateCase);
router.get('/firm/getCaseById/:id',   caseController.getCaseById);
router.get('/firm/getCaseByFirmId/:firmId',   caseController.getCaseByFirmId);


//Client
router.post('/firm/registerClient', clientValidator, clientController.registerClient);
router.get('/firm/getClients', clientController.getClients);
router.delete('/firm/deleteClient/:id',  clientController.deleteClient);
router.patch('/firm/updateClient/:id',  clientController.updateClient);



module.exports = router;