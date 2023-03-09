const mongoose = require( 'mongoose' );

const clientOption = {
	
	keepAlive: true,	
	useNewUrlParser: true,
	useUnifiedTopology: true,	

	// autoIndex: true,

	connectTimeoutMS: 10000,
	socketTimeoutMS: 30000,

};

/**
** CONNECTION EVENTS
**/

/**
** When successfully connected.
**/
mongoose.connection.on( 'connected', () => {

	console.log( 'Mongoose default connection open' );

} );

/**
** If the connection throws an error.
**/
mongoose.connection.on( 'error', err => {

	console.log( 'Mongoose default connection error:', err );

} );

/**
** When the connection is disconnected.
**/
mongoose.connection.on( 'disconnected', () => {

	console.log( 'Mongoose default connection disconnected' );

} );

/**
** If the Node process ends, close the Mongoose connection.
**/
process.on( 'SIGINT', async () => {

	await mongoose.connection.close();

	console.log( 'Mongoose default connection disconnected through app termination' );
	process.exit( 0 );

} );

/**
** @see https://stackoverflow.com/q/40818016
**/
const initAdminDbConnection = async ( DB_URL ) => {

	try {

		const db = await mongoose
			.createConnection( DB_URL, clientOption )
			.asPromise();

		db.on( 'error', console.error.bind(	console, 'initAdminDbConnection MongoDB Connection Error>>: ' ) );
		
		db.once( 'open', () => {
			
			console.log( 'initAdminDbConnection', 'Client MongoDB connection ok!' );
		
		} );

		const tenantSchema = require( '../schema/tenant' );
		db.model( 'Tenant', tenantSchema );

		return db;

	} catch ( error ) {
		
		console.log( 'initAdminDbConnection', 'error', error );
	
	}

};

module.exports = {

	initAdminDbConnection,

};
