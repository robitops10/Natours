const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

// without {mergeParam: true} this router can't access params fields from tourRouter 'Re-Routing' /:marams
const router = new express.Router({mergeParams: true});

// nested route
// POST 	/tours/45334rf2/reviews
// GET 		/tours/45334rf2/reviews/3453fa

/* now because of 	/tours/45334rf2/reviews 	Re-Router redirection.
** 
** if any tour somes via /tours then must have 	'req.params.tourId' 	we can use that on this routers every route.
*/

router.route('/')
	.get(reviewController.getAllReviews)
	.post(authController.protect, authController.restrictTo('user'), reviewController.createReview)


router.route('/:id')
	.delete(reviewController.deleteReview)


router.route('/')

module.exports = router;
