
const sendDevError = (err, res) => {

	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		stack: err.stack,
		// error: err
	});
};


const sendProdError = (err, res) => {

	if( err.isOperational ) { 													// This value comes from User Throw error of AppError => globalErrorController
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});

	} else {
		console.log( err ); 															// log to terminal for crucial error

		res.status(500).json({
			status: 'error',
			message: 'something very very bad'
		});
	}
};






const globalErrorController = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	process.env.NODE_ENV === 'production' ? sendProdError( err, res ) : sendDevError( err, res );

};

module.exports = globalErrorController;
