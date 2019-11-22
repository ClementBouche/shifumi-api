'use strict';

const mongoose = require('mongoose');
const config = require('../config'); // get our config file

require('../api/models/playerModel');
require('../api/models/playModel');

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
const Play = mongoose.model('Plays');

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
  const index = Math.floor(Math.random() * randomColors.length);
  return randomColors[index];
}

Play.find({}, null, null)
.exec()
.then((plays) => {
  plays.forEach((play) => {
    play.boardgame_id = mongoose.Types.ObjectId(play.boardgame_id);
    play.scores = play.scores.map((sc) => {
      sc.player_id = mongoose.Types.ObjectId(sc.player_id);
      return sc;
    });
    play.save().then(() => {
      // console.log(play);
    });
  })
})
.finally(() => {
  // process.exit();
});

Player.find({}, null, null)
.exec()
.then((players) => {
  players.forEach((player) => {
    player.user_id = mongoose.Types.ObjectId(player.user_id);

    player.avatar_image = '';
    const colors = randomGradient();
    player.color_primary = colors[0];
    player.color_accent = colors[1];
    player.color_text = colors[2];
    player.save().then(() => {
      console.log(player);
    });
  })
})
.finally(() => {
  // process.exit();
});

Player.update({}, { 
  $unset: {avatar_colors: true, avatar_color: true },
}, {multi: true, safe: true})
  .exec()
  .then((result) => {
    console.log(result);
  });
