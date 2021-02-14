const AppError = require('./../utils/AppError');

const sendDevError = (err, res) => {

	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});
};


const sendProdError = (err, res) => {

	if( err.isOperational ) { 								// This value comes from User Throw error of AppError => globalErrorController
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});

	} else { 																	// for which error, which we did not handled
		console.log( err ); 										// log to terminal for crucial error

		res.status(500).json({
			status: 'error',
			message: 'something very very bad',

			// error: err,
		});
	}
};



const castErrorHandlerDB = (error) => {
	// it is not express error, so not need to send error into next() function
	// It is MongoDB Error so instead of showing full error, just send nice and clean error to user.
	return new AppError(`Invalid ID Error: ${error.path}: ${error.value} `, 404);
};

const duplicateErrorHandlerDB = (error) => {
	return new AppError(`Duplicate Key Error:  `, 404);
};

const typeErrorHandlerDB = (error) => {
	return new AppError(`(Type Error) Require on: ${error.path} : ${error.kind}, but given: ${error.value} `, 404);
};

const validatorErrorHandlerDB = (key, value) => {
	return new AppError(`(ValidatorError): ${key} error:  ${value} `);
};



const globalErrorController = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	// process.env.NODE_ENV === 'production' ? sendProdError( err, res ) : sendDevError( err, res );
	if( process.env.NODE_ENV === 'development' ) {
		sendDevError( err, res );

		
	} else if( process.env.NODE_ENV === 'production' ) {
		let error = {...err};

		// if invalid id then append our error into error object ==> now error.isOperational == true
		if(error.kind === 'ObjectId' ) error = castErrorHandlerDB(error); 		// store all errors into a single variable
		if(error.code === 11000 ) error = duplicateErrorHandlerDB(error); 						

		// if error exist and if error.reason exist then check error.reason.code
		if(error && error.reason && error.reason.code === 'ERR_ASSERTION' ) error = typeErrorHandlerDB(error); 						


		// First check error.errors exists before use map, 	
		// and before that check error exist before use error.errors property
		if(error && error.errors) Object.entries( error.errors ).map( ( [key, value] ) => { 
			// if( value.name === 'ValidatorError') error = new AppError(`(ValidatorError): ${key} error:  ${value} `);
			if( value.name === 'ValidatorError') error = validatorErrorHandlerDB(key, value);
		});


		// Then finally send full error message to user.
		sendProdError( error, res );
	} 

};

module.exports = globalErrorController;
