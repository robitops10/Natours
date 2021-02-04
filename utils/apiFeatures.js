
class APIFeatures {
	constructor(model, queryString) {
		this.model = model; 												// Mongoose Model
		this.queryString = queryString; 						// Express req.query
	}	

	filter() {
		let queryObj = { ...this.queryString };
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.map( item => delete queryObj[ item ] );

		// (Only for 4 operator) if not use Doller sign like: ?age[gt]=3 	then use bellow 3 line
		let queryStr = JSON.stringify( queryObj ); 					// Now it is String
		queryStr =	queryStr.replace(/\b(gt|lt|gte|lte)\b/g, (match) => `$${match}`);
		queryObj = JSON.parse(queryStr);

		// (For any operator) if use Doller sign like: ?age[$gt]=3 	then remove above 3 line
		this.model = this.model.find( queryObj );

		return this;
	}

	sort() {
		if( this.queryString.sort ) {
			const sortStr = this.queryString.sort.split(',').join(' ');
			this.model = this.model.sort( sortStr );
		} else {
			this.model = this.model.sort('-createdAt'); 											// by default sort by 'createdAt' fields desc
		}
		
		return this;	
	}

	limitFields () {
		if( this.queryString.fields ) {
			const queryStr = this.queryString.fields.split(',').join(' ');
			this.model = this.model.select( queryStr );
		} else {
			this.model = this.model.select('-__v'); 													// Hide __v field
		}
		
		return this;	
	}

	paginate () {
		const page = this.queryString.page * 1 || 1; 										// Convert String => Number + set default value
		const limit = this.queryString.limit * 1 || 10; 									
		const skip = ( page -1 ) * limit; 												// find last page *  limit/page 

		this.model = this.model.skip(skip).limit(limit);

		return this;	
		
		// if( req.query.page ) { 																		// if pass more number of page value than it have
		// 	const tourLength = await Tour.countDocuments();	
		// 	if (skip >= tourLength ) throw new Error('This page not Exist');
		// }
	}

}


module.exports = APIFeatures;




// exports.getAllTours = async (req, res) => {
// 	try{

		// let queryObj = { ...req.query };
		// const excludedFields = ['page', 'sort', 'limit', 'fields'];
		// excludedFields.map( item => delete queryObj[ item ] );

		// // (Only for 4 operator) if not use Doller sign like: ?age[gt]=3 	then use bellow 3 line
		// let queryStr = JSON.stringify( queryObj ); 					// Now it is String
		// queryStr =	queryStr.replace(/\b(gt|lt|gte|lte)\b/g, (match) => `$${match}`);
		// queryObj = JSON.parse(queryStr);

		// // (For any operator) if use Doller sign like: ?age[$gt]=3 	then remove above 3 line
		// let query = Tour.find( queryObj );


		// Enable: Sorting Features
		// if( req.query.sort ) {
		// 	const sortStr = req.query.sort.split(',').join(' ');
		// 	query = query.sort( sortStr );
		// } else {
		// 	query = query.sort('-createdAt'); 											// by default sort by 'createdAt' fields desc
		// }

		// Enable: Filtering Fields Features
		// if( req.query.fields ) {
		// 	const queryStr = req.query.fields.split(',').join(' ');
		// 	query = query.select( queryStr );
		// } else {
		// 	query = query.select('-__v'); 													// Hide __v field
		// }


		// Enable: Pagination  (Limiting) Features
		// const page = req.query.page * 1 || 1; 										// Convert String => Number + set default value
		// const limit = req.query.limit * 1 || 10; 									
		// const skip = ( page -1 ) * limit; 												// find last page *  limit/page 

		// query = query.skip(skip).limit(limit);

		// if( req.query.page ) { 																		// if pass more number of page value than it have
		// 	const tourLength = await Tour.countDocuments();	
		// 	if (skip >= tourLength ) throw new Error('This page not Exist');


		// 	// if (skip > tourLength ) throw errorHandler(res, 404, 'This page not Exist');
		// 			/*
		// 					- if we pass value on throw 	create 	Error of Send header after complete request
		// 					- It is the error, which make be mad.
		// 			*/ 
		// }

// 		const tours = await Tour.model;

// 		res.status(200).json({
// 			status: 'success',
// 			results: tours.length,
// 			data: {
// 				tours
// 			}
// 		});
// 	} catch (err) {
// 		res.status(404).send(err)
// 		// errorHandler(res, 404, err);
// 	}

// };
