const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// const data = Math.random() * 10**32;
// console.log( data );

(async () => {

	const randomValue = crypto.randomBytes(32).toString('hex');
	const hashed = crypto.createHash('sha256').update(randomValue).digest('hex');
	// const hashed = await bcrypt.hash(randomValue, 2)
	console.log( {randomValue, hashed} )

	// const verify = await bcrypt.compare(randomValue, hashed)
	// console.log( verify )

})()

