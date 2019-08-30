'use strict';

const mongoose = require('mongoose');
const config   = require('../config'); // get our config file

require('../api/models/userModel');
require('../api/models/playModel');
require('../api/models/playerModel');

mongoose.Promise = global.Promise;
mongoose.connect(
  config.database, { useNewUrlParser: true }
);

const User = mongoose.model('Users');
const Play = mongoose.model('Plays');
const Player = mongoose.model('Players');

// create a sample user
const new_user = new User({ 
  username: 'nostradamus2', 
  name: 'nostradamus2',
  password: 'nostradamus2',
  admin: false
});
// create a sample player
const new_player = new Player({
  name: 'nostradamus_player2',
});
// create a sample play
const new_plays = [
  new Play({ 
    boardgame_name: 'Love Letter',
    date: '2020-08-30',
    scores: [{
      player_name: 'nostradamus_player',
      score: 20
    }, {
      player_name: 'Clément Bouché',
      score: 10
    }]
  }),
  new Play({ 
    boardgame_name: 'Love Letter',
    date: '2020-08-30',
    scores: [{
      player_name: 'nostradamus_player',
      score: 10
    }, {
      player_name: 'Clément Bouché',
      score: 20
    }]
  }),
];

new_user.save()
  .then(() => {
    return new_player.save();
  })
  .then(() => {
    return Promise.all(new_plays.map((play) => play.save()));
  })
  .then(() => {
    return User.find({}).exec();
  })
  .then(users => {
    console.log(users);
  })
  .then(() => {
    process.exit();
  });
