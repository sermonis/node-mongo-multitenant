const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const userSchema = new Schema( {

	name: {

		type: String,

	},

	phoneNumber: {

		type: String,
		trim: true,
		unique: true,
		required: true,

	},

	password: {

		type: String,
		trim: true,

	},

	email: {

		type: String,
		required: true,

	},

}, {
    
	// toJSON: {
		
	// 	virtuals: true,
	
	// },

	// toObject: {
		
	// 	virtuals: true,
	
	// },
    
	timestamps: true,

} );

userSchema.index( {

	userId: 1,

} );

module.exports = userSchema;
