
// 1) when any error happend inside async function: it is actually Promise Reject
// 2) make sure catchAsync function have function of 3 arguments, else throw error
// 3) catch() method pass the error to Express Global Error handler by next( error )
// 4) so make sure 		app.use( (err, req, res, next) => { res.json({err}) }) 		is defined first.


// . this catchAsync get an entire function as argument, so it hass access entire function + argument variables, everything
// . Now we passing same 3 argument, to that function, while calling
// . if return error thandle by catch, 	after all async function is a Promise.
const catchAsync = (fn) => {
	return (req, res, next) => fn(req, res, next).catch( next ); 
};


module.exports = catchAsync;
