const mongoose = require('mongoose');
// const User = require('./userModel'); 					// to use embaded user = await User.findById(id)

const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	duration : {
		type: Number,
		default: 5
	}, 
	maxGroupSize: {
		type: Number,
		default: 5
	},
	difficulty: {
		type: String,
		enum: ['easy', 'medium', 'difficult'],
		required: true
	}, 
	ratingsAverage : {
		type: Number,
		default: 0
	},
	ratingsQuantity: {
		type: Number
	},
	price: {
		type: Number,
		required: true
	},
	summary: {
		type: String,
		trim: true,
		// maxlength: 300
	},
	description: {
		type: String,
		trim: true,
		// maxlength: 500
	},
	imageCover: {
		type: String
	},
	images: {
		type: [String]
	},
	startDates: {
		type: [Date]
	},
	secretTour : {
		type: Boolean,
		default: false
	}, 
	startLocation: { 										// It is GeoJSON Object which required 2 properties Type : point, coordinates : number
		type: { 																// GeoJSON Data Option
			type: String, 												// Data Type
			default: 'Point',
			enum: ['Point'] 											// only point method allowed.
		},
		coordinates: [Number], 									// GeoJSON Data Option
		address: String,
		description: String,
	},
	locations: [{ 														// for Embaded locations for all tours's location
		type: {
			type: String,
			default: 'Point',
			enum: ['Point']
		},
		coordinates: [Number],
		address: String,
		description: String,
		day: Number
	}],
	// guides: Array 													// To embaded need Array of id 		not ObjectId(id)
	guides: [{
		type: mongoose.Schema.Types.ObjectId, 	// type: mongoose.Schema.ObjectId,
		ref: 'User' 														// No need User model here import, but must be exist in mongoose for userSchema
	}]
}, {
	timestamps: true,
	toJSON: 	{ virtuals: true },
	toObject: { virtuals: true }
});


/* ------------[ Embaded guides from user id ]----------------
	// guides: Array 											// To embaded need Array of id 		not ObjectId(id)

** Get Id inside guides properties as array from req.body
** Map through array and get user by id
** 		. we await the User.findById(), 	so inside map function must be async
** Map returen a list of Promises, 			so handle all promises by Promise.All()
** 		. which return Promise 						so pre( function) also need to be async
** Finally override this.guides of userId 	with 	user
*/
// tourSchema.pre('save', async function(next) {
// 	// we need id string to find user, 			not ObjectId(id)
// 	// to populate we need ObjectId(id) 		not just id String
// 	const guidesPromises = this.guides.map( async (id) => await User.findById(id) )
// 	this.guides =	await Promise.all(guidesPromises);

// 	next();
// });


// populate guides's users from user id. for every find query
tourSchema.pre(/^find/, function(next) {
	this.populate({
		path: 'guides',
		// select: ' name email -__v -role -passwordChangedAt',
		select: 'name email',
		// match: { role: /^admin/},
		// options: {
		// 	limit: 2,
		// 	skip: 1,
		// 	sort: {createdAt: -1}
		// }
	});

	next();
});


// tourSchema.methods.toJSON = function () { 							// this function auto called when mongoDB try to  JSON.stringify()
// 	console.log('toJSON');
// };


// populate 'reviews' fields from Review.tour 	on based on this._id
tourSchema.virtual('reviews', {
	ref: 'Review', 																					// From Review Model
	foreignField: 'tour', 																	// Review.tour
	localField: '_id' 																			// on this._id 		=== 	tour._id
});












const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

