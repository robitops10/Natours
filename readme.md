## NodeJS  API + (Server Side Rendering)

##### Key topics:
	. Better Error Handling
	. Beautiful HTML Template (Pug)
	. MVC Structure wel maintainess.
	. Password Handling The Right Way
	. Both Local & Remote Database Connection. (**dotenv**)
	. Routing


##### `Throw` Keyword only used inside a try..catch block  or async function.
	. Reguler Function can't use `throw` keyword.
	. When throw error inside async function it caught by `Promise.reject()`
			. Promise can handle by then method, no need to use try..catch for every async function.


##### Use catchAsync function to reduce `try..catch` and  throw error by `next()` method:

1. when any error happend inside async function: it is actually Promise Reject
2. make sure catchAsync function have function of 3 arguments, else throw error
3. catch() method pass the error to Express Global Error handler by next( error )
4. so make sure before use next(err) method, set `Express's Global error handler` first.

		const catchAsync = (fn) => {
			return (req, res, next) => {
				fn(req, res, next).catch( next ); 	// fn(req, res, next).catch( err => next(err) );
			}
		};


