const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit'); 					// limit request to prevent brute force attack
const helmet = require('helmet'); 												// Set HTTP Security for headers
const mongoSanitize = require('express-mongo-sanitize'); 	// prevent NoSQL Query injection
const xssClean = require('xss-clean'); 										// convert <html> 	=> 	&gt;html> 	to prevent malicious code.
const hpp = require('hpp'); 															// hpp = HTTP Paramiter Polution: Remove multiple same query from url
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const globalErrorController = require('./controllers/globalErrorController');

const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoute');

const app = express();

app.set('views', './views'); 													// 
app.set('view engine', 'pug'); 												// 

app.use( express.static( path.resolve('public'))); 		// enable Static path
app.use( express.json({limit: '10kb'}) ); 						// Fetch data from client by req.body

if( process.env.NODE_ENV === 'development' ) {
	app.use( morgan('dev') ); 													// View Request: Method 	URL 	ResponseTime(ms) 	ResponseSize(Byte)
}

const limiter = rateLimit({ 													// (1) define express-rate-limit
	max: 100, 																					// if cross limit, fire message error + see in header
	windowMs: 1000 * 60 * 60, 													// window per miliseconds: I set for per hour
	message: 'Too many request from this IP. please try it with in one hour'
});
app.use('/api', limiter); 														// (2) limiter function

app.use( helmet() ); 																	// add some secure headers. see in header after request
app.use( mongoSanitize() ); 													// name: {"$gt" : ""}, "password": "asdfasdf"
app.use( xssClean() ); 																// Convert any html '<' => &gt; 	to prevent malicious html attack
app.use( hpp({ 																				// remove duplicate query : ?sort=price&sort=ratingsAverage
	whiteList: [ 																				// allow whiteList query as duplicate.
		'duration' 																				// allow duration to be ?duration=5&duration=9 		
	]
})); 																		


app.use( (req, res, next) => {
	// console.log( req.get('Content-Type') )
	next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);





// ----[ Put this after Every route but before Global error handler end ]--------
app.all('*', (req, res, next ) => next( new AppError(`(/): No Route found by: [ ${req.originalUrl} ] `, 404) ));
// ----[ Put this Very end ]--------
app.use( globalErrorController );

module.exports = app;
