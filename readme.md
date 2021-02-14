## NodeJS  API + (Server Side Rendering)

##### Key topics:
	. Better Error Handling
	. Beautiful HTML Template (Pug)
	. MVC Structure wel maintainess.
	. Password Handling The Right Way
	. Both Local & Remote Database Connection. (**dotenv**)
	. Routing
	. Forgot password & reset by emailed token


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
				fn(req, res, next).catch( next ); // fn(req, res, next).catch( err => next(err) );
			}
		};


### Error Handling 
There are 4 type of Errors:
1. Express Error 	: If something wrong inside express == Web Server, Throw Error.
2. MongoDB Error 	: If something wrong inside MongoDB == Database Server, Throw Error.
3. 3rd party Error: jsonwebtoken nodemailer
4. User Error 		: Programming Errors

	**Non't Use `next()` for throwing MongoDB error. It is only for express.**


##### MongoDB Error again 4 Types:
1. Invalid ID Error : if(err.kind === 'ObjectId') res.status(404).json({message: 'Invalid Id'})
2. Duplication Error :
3. Validation Error :
4. Type Error :

	**Only Modify MongoDB Error for Production User To send nice & limited info**



##### Password Reset Functionality
- Generate Random value (same hashed in DB & send unhashed to user)
- send the passwordResetToken to user via email.
- get the token from email & after hashed find user by the token
- if user found then update user, with new password, get from user
- and send jwt the login token 
