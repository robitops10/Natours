const catchAsync = require('./../utils/catchAsync');
const Review = require('./../models/reviewModel');

// if route comes vie /tours/:tourId/reviews, then req.params.tourId is available.


exports.getAllReviews = catchAsync( async (req, res, next) => {

	/* now this single route produce 2 results
	** if comes from 		/tours/:tourId/reviews 	=> 	then Only view toures related to that tourId
	** else comes from 	/reviews 								=> 	then Only view all reviews of any tours 
	*/
	const filter = req.params.tourId ? {tour: req.params.tourId} : {}; 	// this tour actually tourId, to populate tour. 

	const reviews = await Review.find( filter );

	res.status(200).json({
		status: 'success',
		count: reviews.length,
		data: { reviews }
	});
});


exports.createReview = catchAsync( async (req, res, next) => {
	// if this route some by /tours/:tourId/reviews 	then it hass this 2 property. 
	if(!req.body.tour) req.body.tour = req.params.tourId; 
	if(!req.body.user) req.body.user = req.user.id;

	const { review, rating, tour, user } = req.body;
	const data = await Review.create({ review, rating, tour, user });


	res.status(201).json({
		status: 'success', 
		data: { data }
	});

});



exports.deleteReview = catchAsync( async (req, res, next) => {

	const review = await Review.findByIdAndDelete(req.params.id);

	res.status(204).json({
		status: 'success', 
		data: null
	});

});

