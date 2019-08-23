'use strict';

const mongoose = require('mongoose');
const config = require('../config'); // get our config file

require('../api/models/userModel');

mongoose.Promise = global.Promise;
mongoose.connect(
  config.database,
  { 
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

const User = mongoose.model('Users');

let user, password;

if (process.argv.length > 3) {
  // look for <user>
  user = process.argv[2];
  password = process.argv[3];
} else {
  console.log('Veuillez renseigner l\'user et le mot de passe');
  process.exit();
}

console.log('Run command with following parameters :', user);

User.find({
    $or: [
      { id: user },
      { username: user }
    ]
  })
  .exec()
  .then((users) => {
    const user = users[0];
    user.password = password;
    console.log(user);
    return user.save();
  })
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    process.exit();
  });
