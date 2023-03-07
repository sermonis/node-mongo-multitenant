const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const helmet = require( 'helmet' );
const path = require( 'path' );

const { connectAllDb } = require( './connectionManager' );

// Express app instance.
const app = express();
const PORT = 9002;

app.set( 'port', PORT );

// Add helmet headers for security purpose.
app.use( helmet() );

// Logging HTTP-requests.
const log4js = require( 'log4js' );
const appLogger = log4js.getLogger();
app.use( log4js.connectLogger( appLogger ) );

// CORS - To handle cross origin requests.
const cors = require( 'cors' );
app.use( cors() );

// Parsing the body of the http.
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );

connectAllDb();

global.appRoot = path.resolve( __dirname );

// Mount the api routes.
const router = require( './api/routes' );
router( app );

app.listen( PORT, () => {
	
	console.log( `Express server started at port: ${ PORT }` );

} );
