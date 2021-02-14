const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.getAllUsers = catchAsync( async (req, res, next) => {
	const users = await User.find();
	// const users = await User.find().select('+password')

	res.status(200).json({
		status: 'success',
		count : users.length,
		users
	});

});


exports.getUserById = catchAsync( async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if(!user) return next( new AppError('User Not found', 404));

	res.status(200).json({
		status: 'success',
		user
	});

});


exports.me = catchAsync( async (req, res, next) => {
	const user = req.user;

	res.status(200).json({
		status: 'success',
		user
	});

});


// exports.createUser =  is actually user signup in authController.js



exports.deleteUserById = catchAsync( async (req, res, next) => {
	const users = await User.findByIdAndDelete(req.params.id);

	res.status(204).json({
		status: 'success',
		data: null
	});

});




