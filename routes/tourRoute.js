const express = require('express');
const tourController = require('./../controllers/tourController');
const AppError = require('./../utils/AppError');

const router = new express.Router();



router.route('/top-5-cheap-tours').get(tourController.topFiveCheapTours, tourController.getAllTours);


router.route('/')
	.get(tourController.getAllTours)
	.post(tourController.createTour);

router.route('/:id')
	.get(tourController.getSingleTour)
	.patch(tourController.updateTour)
	.delete(tourController.deleteTour);



// ----[ Put this Very end ]--------
router.all('*', (req, res, next) => next( new AppError(`(/tours): No Route Found by [ ${req.originalUrl} ] `, 404) ));

module.exports = router;
