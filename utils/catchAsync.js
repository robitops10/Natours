
// 1) when any error happend inside async function: it is actually Promise Reject
// 2) make sure catchAsync function have function of 3 arguments, else throw error
// 3) catch() method pass the error to Express Global Error handler by next( error )
// 4) so make sure before use next(err) method, set global error handler first.

const catchAsync = (fn) => {
	return (req, res, next) => {
		// fn(req, res, next).catch( err => next(err) );
		fn(req, res, next).catch( next );
	}
};


module.exports = catchAsync;
