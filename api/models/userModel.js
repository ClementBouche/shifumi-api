// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var UserSchema = new Schema({ 
    username: String,
    password: String,
    email: String,
    surname: String,
    lastname: String,
    admin: Boolean
});

module.exports = mongoose.model('Users', UserSchema);
