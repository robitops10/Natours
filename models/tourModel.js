const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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
		// enum: ['easy', 'medium', 'hard'],
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
	}
}, {
	timestamps: true
});


const Tour = mongoose.model('Tour', schema);

module.exports = Tour;

