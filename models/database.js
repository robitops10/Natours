const mongoose = require('mongoose');
const chalk = require('chalk');


const DB_ATLAS = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);
const DB_LOCAL = process.env.DATABASE_LOCAL;
const DATABASE = false ? DB_ATLAS : DB_LOCAL;

mongoose.connect( DATABASE, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true 								// Enable Index in Database 
})
	.then(conn => console.log( chalk.bold.white(`DATABASE: Connection successful !!!`)))
	.catch(error => console.log( chalk.bold.red(`Opps!!! DATABASE: Connection Faild`)))


