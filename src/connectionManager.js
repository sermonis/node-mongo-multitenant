const { getNamespace } = require( 'continuation-local-storage' );

const { BASE_DB_URI, ADMIN_DB_NAME } = require( './config/env.json' );

const { initAdminDbConnection } = require( './db/admin' );
const { initTenantDbConnection } = require( './db/tenant' );

const tenantService = require( './service/tenant' );

let connectionMap;
let adminDbConnection;

/**
** Create knex instance for all the tenants 
** defined in common database and store in a map.
**/
const connectAllDb = async () => {

	let tenants;

	const ADMIN_DB_URI = `${ BASE_DB_URI }/${ ADMIN_DB_NAME }`;

	adminDbConnection = await initAdminDbConnection( ADMIN_DB_URI );

	try {
	
		tenants = await tenantService.getAllTenants( adminDbConnection );
	
	} catch ( e ) {
		
		console.log( 'connectAllDb', 'error', e );
		return;
	
	}

	connectionMap = tenants.map( tenant => {

		return {
			
			[ tenant.name ]: initTenantDbConnection( tenant.dbURI ),
		
		};
	
	} ).reduce( ( prev, next ) => {
		
		return Object.assign( {}, prev, next );
	
	}, {} );

};

/**
** Get the connection information (knex instance)
** for the given tenant's slug.
**/
const getConnectionByTenant = async tenantName => {

	if ( connectionMap ) {

		return await connectionMap[ tenantName ];

	}

};

/**
** Get the admin db connection.
**/
const getAdminConnection = () => {

	if ( adminDbConnection ) {

		return adminDbConnection;

	}

};

/**
** Get the connection information (knex instance) for current context. 
** Here we have used a getNamespace from 'continuation-local-storage'. 
** This will let us get / set any information and binds 
** the information to current request context.
**/
const getConnection = () => {

	const nameSpace = getNamespace( 'unique context' );
	const conn = nameSpace.get( 'connection' );
  
	if ( !conn ) {

		throw new Error( 'Connection is not set for any tenant database' );

	}
  
	return conn;

};

module.exports = {

	connectAllDb,
	getAdminConnection,
	getConnection,
	getConnectionByTenant,

};
