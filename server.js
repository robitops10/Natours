// -------- This 2 handler must be before other code, because, if error ouccered before this thandler can't handle that.

	// unhandledRejection require server variable, so use immediately after ti.

// it will handle un caught exception 
process.on('uncaughtException', (err) => {
	console.log( 'uncaughtException: ', err );	
	process.exit(1);
});




// ---------------------------- Error handler both are optional

require('dotenv').config({ path: './config.env' });
require('./models/database');

const chalk = require('chalk');
const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log( chalk.white.bold(`Server is Running on : ${port}`) ));







// it will handle un handled promise here
process.on('unhandledRejection', (err) => {
	console.log( 'Global Unhandled Promise Rejection Handler', err.name, err.message );

	server.close( () => { 			// inside server.close() 	will give some time to complete running request then close
		process.exit(1); 					// shutdown process 0=Ok, 1=unhandledRejection
	});
});


