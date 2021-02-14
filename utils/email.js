const nodemailer = require('nodemailer');

/*
	Commarcial 			: gmail : is not suitable for production app for free : more than 500 email/day => Identify as spamer
	Alternative 		: sendgrid | mailgun
	For Development : mailtrap 	( Fake email server )

*/

const sendMail = async ({from = '<robitops10@gmail.com', to, subject, text} = {}) => {

	// 1) set up createTransport()
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD
		}
	});

	// 2) send the email
	await transporter.sendMail( {from, to, subject, text } );
};

module.exports = sendMail;
