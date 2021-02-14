const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please insert valid email address' ]
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		select: false
	},
	confirmPassword: {
		type: String,
		required: true,
		validate: {
			// this validation only work on save, not with findAndUpdate or else.
			validator: function(val) { return this.password === this.confirmPassword },
			message: 'password is not matched'
		}
	},
	photo: {
		type: String,
	},
	passwordChangedAt: Date,
	role: {
		type: String,
		enum: ['user', 'guide', 'lead-guide', 'admin'],
		default: 'user'
	},
	passwordResetToken : String,
	passwordResetExpires: Date

});


userSchema.pre('save', async function (next) {
	if( !this.isModified('password') ) return next(); 				// if not modified the password field only then do bellow 

	this.password = await bcrypt.hash( this.password, 12); 		// hash the password
	this.confirmPassword = undefined; 												// JSON.stringify(obj) remove the filelds, which value = undefined

	next();
});


userSchema.methods.verifyPassword = async (password, hashedPassword) => {
	return await bcrypt.compare(password, hashedPassword);
};


userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	return JWTTimestamp < Date.parse(this.passwordChangedAt / 1000);
};

// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
// 	if(this.passwordChangedAt) {
// 		const changedPasswordTimestamp = Date.parse(this.passwordChangedAt / 1000);

// 		return JWTTimestamp < changedPasswordTimestamp; 		// 100 < 200   	latter time is always biger than previous
// 	}
// 	return false;
// };

userSchema.methods.createPasswordResetToken = async function() {
	const resetToken = crypto.randomBytes(32).toString('hex'); 							// Generate Random value

	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	// this.passwordResetToken = await bcrypt.hash(resetToken, 2);
	this.passwordResetExpires = Date.now() + 1000 * 60 * 10; 								// 10 minute
	this.save({validateBeforeSave: false}); 																// save the document after modify

	return resetToken;
};




const User = mongoose.model('User', userSchema);
module.exports = User;
