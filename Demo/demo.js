
// 	fn function is a callback function which have 3 argument, passed when it called
// inner annonymous function have access thies 3 arguments, 
// which passed to self called again, with that arguments
const catchAsync = fn => {
	return (req, res, next) => {
		fn( req, res, next ).catch( err => console.log(err) )
	}
}

catchAsync( async ( req, res, next ) => {
	if(!false) throw new Error('message')
	console.log( req, res, next )
}) ('a', 'b', 'c')







// const func = async () => {
// 	throw 'my data not found error'	
// };

// func().then(console.log).catch(console.log);


// ( async () => {
// 	try {
// 		const data = await func()
// 	} catch (err) {
// 		console.log( err)
// 	}
// }) ();
