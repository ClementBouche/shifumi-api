'use strict';

const mongoose = require('mongoose');
const config   = require('./config'); // get our config file

require('./api/models/userModel');

mongoose.Promise = global.Promise;
mongoose.connect(
  config.database, { useNewUrlParser: true }
);

const User = mongoose.model('Users');

// create a sample user
const new_user = new User({ 
  username: 'cbouche', 
  name: 'Bouché',
  password: 'cbouche',
  admin: true 
});
console.log(new_user);

// update or create
User.findOneAndUpdate({
  username: 'cbouche'
}, new_user, {new: true, upsert: true}, function(err, user) {
  if (err) return console.error(err);

  console.log(user);
});

// list
User.find({}, function(err, users) {
  if (err) return console.error(err);

  console.log(users);
});
