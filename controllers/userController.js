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


exports.getMe = catchAsync( async (req, res, next) => {
	const user = req.user;

	res.status(200).json({
		status: 'success',
		user
	});

});


const filterObj = (body, ...allowedField) => {
	const newObj = {};

	Object.keys(body).forEach( item => {
		if( allowedField.includes(item) ) newObj[item] = body[item];
	});

	return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {

	// 1) create Error if post password Data
	const message = 'This route not for update password, use "updateMyPassword"';
	if(req.body.password || req.body.confirmPassword) return next(new AppError(message, 400));

	// 2) pass filtered data
	const data = filterObj(req.body, 'name', 'email');

	// 3) update user
	const user = await User.findByIdAndUpdate(req.user.id, data, {
		new: true,
		runValidators: true
	});

	res.status(201).json({
		status: 'success',
		user
	});
});


exports.deleteMe = catchAsync( async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.user.id, {active: false});

	res.status(204).json({
		status: 'success',
		data: null
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




