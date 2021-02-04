require('dotenv').config({ path: './config.env' });
require('./models/database');

const chalk = require('chalk');
const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log( chalk.white.bold(`Server is Running on : ${port}`) ));


