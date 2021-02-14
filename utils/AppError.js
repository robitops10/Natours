
class appError extends Error {
	constructor(message, statusCode) { 											// When we instantiate, we ask 2 arguments: message & status code
		super(message); 																			// pass the message to new Error(message) : so we have err.message property

		this.statusCode = statusCode || 500; 									// create appError.statusCode = <> user given status code
		this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error'; 	// convert statusCode to String to use str.startsWith()
		this.isOperational = true; 														// this property deside, is this error throw by me or Express

		// Error.captureStackTrace(this, this.constructor); 	// By default it is set by Error
	}
}


module.exports = appError;


