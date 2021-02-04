const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve('config.env')});
require('./../models/database');


const Tour = require('./../models/tourModel');

const file = path.resolve('dev-data/tours-sample.json');
const tours = JSON.parse(fs.readFileSync(file, 'utf-8'));

const importData = async () => {
	try{
		await Tour.create( tours );
		console.log('Data loaded successfully !!!');

	} catch(err) {
		console.log( 'Opps!! : ' + err );
	}
};

// importData(); 		// not working
