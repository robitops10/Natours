const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = new express.Router();



router.post('/signup', authController.signup );
router.post('/login', authController.login );

router.post('/forgotPassword', authController.forgotPassword );
router.patch('/resetPassword/:token', authController.resetPassword );




router.route('/')
	.get(userController.getAllUsers)

router.route('/me').get(authController.protect, userController.me); 		// must be before /:id = else throw error

router.route('/:id')
	.get(userController.getUserById)
	.delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), userController.deleteUserById)



module.exports = router;
