const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
	review: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		min: 1,
		max: 5,
		default: 4.5
	},
	tour: {
		type: mongoose.Schema.Types.ObjectId, 						// For tourId
		ref: 'Tour', 																			// name of the Tour Model
		required: true
	},
	user: {
		type: mongoose.Schema.ObjectId, 									// For UserId
		ref: 'User', 																			// name of the User Model
		required: true
	}

}, {
	timestamps: true,
	// toObject 	: { virtuals: true },
	// toJSON 		: { virtuals: true }
});




// Tours 		- Reviews 	=> 	1:M 					: Parent Referencing 	: Every Review only have to single Tours
// Reviews 	- Users			=> 	1:M 					: Child Referencing 	: Single User can have Multiple Reviews


/*
** populate tour{ ref: 'Tour'} and populate user{ ref: 'User'}
** Fore more details see the tourSchema
*/
// reviewSchema.pre(/^find/, function(next) { 										// Method-1: 
// 	this.populate('tour user', '-__v'); 													// populate both field in single query.
// 	next();
// });

reviewSchema.pre(/^find/, function(next) { 												// Method-2:
	// this.populate('tour', '-__v').populate('user', '-__v');  		// Seperate query populate for every fields.
	// this.populate({
	// 	path: 'tour ',
	// 	select: 'name price image -guides'
	// }).populate({
	// 	path: 'user',
	// 	select: 'name email -_id'
	// });

	this.populate({
		path: 'user',
		select: 'name email -_id'
	})

	next();
});


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
