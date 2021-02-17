const {promisify} = require('util');
const User 				= require('./../models/userModel');
const catchAsync 	= require('./../utils/catchAsync');
const AppError 		= require('./../utils/AppError');
const jwt 				= require('jsonwebtoken');
const validator 	= require('validator');
const sendMail 		= require('./../utils/email');
const crypto = require('crypto');


// we can used this token on schema as hook, and save into database too, which used to logout
const signToken = id => jwt.sign( {id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN} );

const sendTokenWithResponse = (user, statusCode, res) => {
	const token = signToken( user.id );

	// setup cookie
	const cookieOptions = { 	 						// 								N							sec 	min 	hrs Day
		expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24 ),
		httpOnly: true 											// Only accessable via http Request, not by user manually
		// secure: true, 										// Only HTTPS
	};
	if( process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	res.cookie('jwt', token, cookieOptions);



	user.password = undefined; 						// don't show user.password even from view from req.body.password
	res.status(statusCode).json({
		status: 'success',
		token,
		data: { user }
	});
};


// problem: signup not add token, why ?
exports.signup = catchAsync( async (req, res, next) => {
	const { name, email, password, confirmPassword, role } = req.body;

	const user = await User.create({ name, email, password, confirmPassword, role });
	sendTokenWithResponse( user, 201, res);
});



exports.login = catchAsync( async (req, res, next) => {
	const {email, password} = req.body;

	// 1) check email & password is exists
	if(!email) 		return next( new AppError('Please insert email', 400));
	if(!password) return next( new AppError('Please insert password', 400));

	// 2) find user by email then check user password is correct
	const user = await User.findOne( {email} ).select('+password'); 								// show hidden password field

	const verified = user && await user.verifyPassword( password, user.password ); 	// if user exist then check user.properties
	if( !user || !verified) return next(new AppError('Incorrect email or password', 401) );

	// 3) if every thing is ok, then send token to client
	sendTokenWithResponse( user, 200, res);
});


exports.protect = catchAsync( async (req, res, next) => {
	// 1) get the the token. from headers or cookie
	const token = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
	if( !token ) return next( new AppError('You are not loged in. Please login first.', 401));


	// 2) get user by user id found inside token after verified
	// const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);	 						// auto throw error if verify() failed.
	const tokenVerified = await promisify(jwt.verify)(token, process.env.JWT_SECRET);	 		// make asynchronous function

	const user = await User.findById(tokenVerified.id);
	if( !user ) return next( new AppError('Not found. This user is not exists', 404));


	// 3) check is user changed password, after token issued
	if(user.changedPasswordAfter(tokenVerified.iat)) return next( new AppError('Please login in again', 401));

	// 4) add that user into req object as req.user = user;
	req.user = user;

	next();
});




exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		// if current user role is not inside the roles array, then current user can't perform this operation.
		if(!roles.includes(req.user.role)) return next(new AppError('You don\'t have permission. ', 403));

		next();
	};
};


exports.forgotPassword = catchAsync(async (req, res, next) => {
	// 1) get Email & check valid email
	const {email} = req.body;
	if(!email) return next(new AppError('Please add Email address first', 404));

	if(!validator.isEmail(email)) return next(new AppError(`invalid email: ${email}`, 400));

	// 2) find user
	const user = await User.findOne({email});
	if(!user) return next(new AppError('no user found, Please signup', 404));

	// 3) Generate random token
	const resetToken = await user.createPasswordResetToken(); 		// await because the function is async so return promise

	const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
	// 4) Send token as email


	try{ 															// special catch for sendMail()
		await sendMail({
			to: user.email, 							// req.body.email || email || user.email 	all are same
			subject: 'Your Password Reset Token (valid for 10 minutes)',
			text: `Submit a PATCH request to ${resetUrl} \n\n\nif you didn't forget your password then ignore this email`
		});

		res.status(200).json({
			status: 'success',
			message: 'token send to your email'
		});

	} catch(err) {
		user.passwordResetToken = undefined; 										// reset this field, which created in step 3) 
		user.passwordResetExpires = undefined;
		await user.save({validateBeforeSave: false}); 					// save user

		return next( new AppError('There is a email sending error. Try again later.', 500))
	}
});




exports.resetPassword = catchAsync(async (req, res, next) => {
	// 1) hash the un-incripted token, so that can find user by it.
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

	// 2) get user by token &  check token is not expires by mongoDB.
	const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now() }});
	if(!user) return next(new AppError('Invalid token or expires time', 400));

	// 3) update 'passwordChangedAt' property
	user.password = req.body.password;
	user.confirmPassword = req.body.confirmPassword;
	user.passwordChangedAt = Date.now();
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	// 4) sent JWT to login
	sendTokenWithResponse( user, 200, res);
});



exports.updateMyPassword = catchAsync(async (req, res, next) => {
	// 1) get user from collection  (get user.id from loged in user)
	const user = await User.findById(req.user.id).select('+password');

	// 2) check posted password is correct
	const isVerified = await user.verifyPassword(req.body.currentPassword, user.password);
	if(!isVerified) return next( new AppError('Sorry, your password is wrong', 401));

	// 3) update password
	user.password = req.body.password;
	user.confirmPassword = req.body.confirmPassword;
	user.passwordChangedAt = Date.now();
	await user.save();

	// 4) add jwt token to login
	sendTokenWithResponse( user, 201, res);
});
