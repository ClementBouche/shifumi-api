// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var UserSchema = new Schema({ 
    username: String,
    password: String,
    email: String,
    // email activation
    activated: Boolean,
    surname: String,
    lastname: String,
    admin: Boolean,
    thumbnail: { type: String },
    image: { type: String },
    //
    player_id: String,
    player_ids_claimed: [String],
});

module.exports = mongoose.model('Users', UserSchema);
