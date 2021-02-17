const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = new express.Router();



router.post('/signup', authController.signup );
router.post('/login', authController.login );

router.post('/forgotPassword', authController.forgotPassword );
router.patch('/resetPassword/:token', authController.resetPassword );
router.patch('/updateMyPassword', authController.protect, authController.updateMyPassword );
router.patch('/updateMe', authController.protect, userController.updateMe );
router.delete('/deleteMe', authController.protect, userController.deleteMe );




router.route('/')
	.get(userController.getAllUsers)

router.route('/me').get(authController.protect, userController.getMe); 		// must be before /:id = else throw error

router.route('/:id')
	.get(userController.getUserById)
	.delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), userController.deleteUserById)
	// .get(userController.deleteUserById)



module.exports = router;
