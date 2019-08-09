'use strict';

const mongoose = require('mongoose');
const config = require('./config'); // get our config file

require('./api/models/playerModel');

mongoose.Promise = global.Promise;
mongoose.connect(
  config.database,
  { 
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

const Player = mongoose.model('Players');

const randomColors = [
  ['#001f3f', '#001f3f', 'hsla(210, 100%, 75%, 1.0)'],
  ['#0074D9', '#0074D9', 'hsla(208, 100%, 85%, 1.0)'],
  ['#7FDBFF', '#7FDBFF', 'hsla(197, 100%, 20%, 1.0)'],
  ['#39CCCC', '#39CCCC', 'hsla(153, 43%, 15%, 1.0)'],
  ['#3D9970', '#3D9970', 'hsla(127, 63%, 15%, 1.0)'],
  ['#01FF70', '#01FF70', 'hsla(146, 100%, 20%, 1.0)'],
  ['#FFDC00', '#FFDC00', 'hsla(52, 100%, 20%, 1.0)'],
  ['#FF851B', '#FF851B', 'rgb(128, 6, 0)'],
  ['#FF4136', '#FF4136', 'rgb(102, 48, 0)'],
  ['#85144b', '#85144b', 'rgb(235, 122, 177)'],
  ['#F012BE', '#F012BE', 'rgb(101, 6, 79)'],
  ['#B10DC9', '#B10DC9', 'rgb(239, 169, 249)'],
  ['#111111', '#111111', 'rgb(221, 221, 221)'],
  ['#AAAAAA', '#AAAAAA', 'black'],
  ['#DDDDDD', '#DDDDDD', 'black'],
];

const randomGradient = function() {
  const index = Math.round(Math.random() * randomColors.length);
  return randomColors[index];
}

const updatePlayer = function(player) {
  player.avatar_colors = ['#ddd', '#ddd', 'black'];
  player.avatar_colors = randomGradient();

  player.save(() => {
    console.log(`${player.name} updated`, player.avatar_colors);
  });
}

// Run script
/**
 * Search all players
 * - update each player
 */
const condition = {};
const options = {
  sort: {}
};
// options.limit = 100
// options.skip = 10
Player.find(condition, null, options, function(err, players) {
    if (err) console.error(err);

    players.forEach((player) => {
      updatePlayer(player);
    });

  }
);

