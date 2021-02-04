const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');





exports.topFiveCheapTours = ( req, res, next) => {
	/*
			-  we just add some property in 	'req.query' 	object
			-  which will process by the next middleware => getAllTours.
			-  getAllTours: knows how to handle with 'req.query' object.
	*/
	req.query.limit = 5;
	req.query.sort = 'price,ratingsAverage';
	req.query.fields = 'name,difficulty,price,ratingsAverage';

	next();
};




exports.getAllTours = catchAsync( async (req, res, next) => {
	let features = new APIFeatures(Tour, req.query).filter().sort().limitFields().paginate();
	const tours = await features.model;

	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			tours
		}
	});
});



exports.createTour = catchAsync( async (req, res, next) => {
	const tour = await Tour.create( req.body );

	res.status(201).json({
		status: 'success',
		data: {
			tours: req.body
		}
	});
});


exports.getSingleTour = catchAsync( async (req, res, next) => {
	const tour = await Tour.findById(req.params.id);

	if( !tour ) return next( new AppError('No Tour found.', 404) );

	res.status(200).json({
		status: 'success',
		data: {
			tour
		}
	});
});


exports.updateTour = catchAsync( async (req, res, next) => {
	const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
		new : true,
		runValidators: true
	});

	res.status(200).json({
		status: 'success',
		data: {
			tour
		}
	});
});


exports.deleteTour = catchAsync( async (req, res, next) => {
	const tour = await Tour.findByIdAndDelete(req.params.id);

	res.status(204).json({
		status: 'success',
		data: null
	});
});

