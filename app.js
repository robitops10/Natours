const path = require('path');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const globalErrorController = require('./controllers/globalErrorController');

const tourRouter = require('./routes/tourRoute');

const app = express();

app.use( express.static( path.resolve('public'))); 		// enable Static path
app.use( express.json() ); 														// Enable Form Data to Node App 

app.set('views', './views'); 													// 
app.set('view engine', 'pug'); 												// 


if( process.env.NODE_ENV === 'development' ) {
	app.use( morgan('dev') ); 													// View Request: Method 	URL 	ResponseTime(ms) 	ResponseSize(Byte)
}


app.use('/api/v1/tours', tourRouter);





// ----[ Put this after Every route but before Global error handler end ]--------
app.all('*', (req, res, next ) => next( new AppError(`(/): No Route found by: [ ${req.originalUrl} ] `, 404) ));
// ----[ Put this Very end ]--------
app.use( globalErrorController );

module.exports = app;
