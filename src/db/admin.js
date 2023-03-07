const mongoose = require( 'mongoose' );

mongoose.Promise = global.Promise;

const clientOption = {
	
	socketTimeoutMS: 30000,
	keepAlive: true,
	poolSize: 5,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,

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
process.on( 'SIGINT', () => {

	mongoose.connection.close( () => {

		console.log( 'Mongoose default connection disconnected through app termination' );
		process.exit( 0 );

	} );

} );

/**
** @see https://stackoverflow.com/q/40818016
**/
// const initAdminDbConnection = async ( DB_URL ) => {
const initAdminDbConnection = DB_URL => {

	try {

		// const db = await mongoose.createConnection( DB_URL, clientOption ).asPromise();
		const db = mongoose.createConnection( DB_URL, clientOption );

		console.log( 'initAdminDbConnection', 'db', db );
		// console.log( 'initAdminDbConnection', 'DB_URL', DB_URL );
		console.log( 'initAdminDbConnection', 'db.name', db.name );
		console.log( 'initAdminDbConnection', 'db.readyState', db.readyState );

		db.on( 'error', console.error.bind(	console, 'initAdminDbConnection MongoDB Connection Error>>: ' ) );
		
		db.once( 'open', () => {
			
			console.log( 'initAdminDbConnection', 'Client MongoDB connection ok!' );
		
		} );

		// require all schemas !?
		require( '../dbModel/tenant/schema' );

		return db;

	} catch ( error ) {
		
		// console.log( 'DB_URL', 'error', DB_URL );
		console.log( 'initAdminDbConnection', 'error', error );
	
	}

};

module.exports = {

	initAdminDbConnection,

};
