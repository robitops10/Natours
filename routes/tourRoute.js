const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const AppError = require('./../utils/AppError');

const reviewRouter = require('./reviewRoute');


const router = new express.Router();


// const reviewController = require('./../controllers/reviewController');

// nested route
// POST 	/tours/45334rf2/reviews
// POST 	/tours/45334rf2/reviews/3453fa

// router.route('/:tourId/reviews')
// 	.post(authController.protect, authController.restrictTo('user'), reviewController.createReview)

/* ----------[ Re-Routing ]----------
** Insted of above 6 commented line, use this 'Routing Merge' Technique, so that all review routes sits on same file.
** 
** redirect to other router, as we did in app.js 	'/api/v1/tours/, routerName'
** if get 	/api/v1/tours/2342434/reviews 	then goto =>  /api/v1/reviews route
*/





router.use('/:tourId/reviews', reviewRouter); 		// Re-Route to Review Router


router.route('/top-5-cheap-tours').get(tourController.topFiveCheapTours, tourController.getAllTours);

router.route('/')
	.get(authController.protect, tourController.getAllTours)
	.post(tourController.createTour);

router.route('/:id')
	.get(authController.protect, tourController.getSingleTour)
	.patch(tourController.updateTour)
	// .delete(tourController.deleteTour)
	.delete(authController.protect, authController.restrictTo('admin'), tourController.deleteTour);









// ----[ Put this Very end ]--------
router.all('*', (req, res, next) => next( new AppError(`(/tours): No Route Found by [ ${req.originalUrl} ] `, 404) ));

module.exports = router;
