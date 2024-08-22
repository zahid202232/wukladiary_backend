const express = require('express');
const router = express();

const auth = require('../middlewares/authMiddleware');

const { addCategoryValidator, categoryDeleteValidator, updateCategoryValidator, createPostValidator, postDeleteValidator, updatePostValidator } = require('../helpers/adminValidator');
const { createUserValidator, updateUserValidator, deleteUserValidator } = require('../helpers/userValidator');

const { postLikeAndUnlikeValidator, postLikeCountValidator } = require('../helpers/postValidator');

const categoryController = require('../controllers/categoryController');

const postController = require('../controllers/postController');

const userController = require('../controllers/userController');

const likeController = require('../controllers/likeController');


// Authenticated Routes Starts Here (Authorization token needed) -----------


// Category Routes

router.post('/add-category',  addCategoryValidator, categoryController.addCategory);
router.get('/get-categories',  categoryController.getCategories);
router.post('/delete-category',  categoryDeleteValidator, categoryController.deleteCategory);
router.post('/update-category',  updateCategoryValidator, categoryController.updateCategory);


//  Post Routes

router.post('/create-post',  createPostValidator, postController.createPost);
router.get('/get-posts',  postController.getPosts);
router.post('/delete-post',  postDeleteValidator, postController.deletePost);
router.post('/update-post',  updatePostValidator, postController.updatePost);


// Users Routes

router.post('/create-user',  createUserValidator, userController.createNewUser);
router.get('/get-users',  userController.getUsers);
router.post('/update-user',  updateUserValidator, userController.updateUser);
router.post('/delete-user',  deleteUserValidator, userController.deleteUser);


// Like and Unlike API Routes

router.post('/post-like',  postLikeAndUnlikeValidator, likeController.postLike);
router.post('/post-unlike',  postLikeAndUnlikeValidator, likeController.postUnlike);
router.post('/post-like-count',  postLikeCountValidator, likeController.postLikeCount);

module.exports = router;