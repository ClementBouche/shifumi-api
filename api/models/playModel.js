'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var locationSchema = new Schema({
//   name: {
//     type: String
//   }
// });
//
// var playerSchema = new Schema({
//   player_name: {
//     type: String
//   }
// });

var PlaySchema = new Schema({
  play_id: {
    type: Number
  },
  date: {
    type: String
  },
  location: {
    type: String
  },
  boardgame_id: {
    type: Number
  },
  boardgame_name: {
    type: String
  },
  players: [{
    name: {
      type: String
    },
    score: {
      type: Number
    },
    win: {
      type: Number
    }
  }]
});

module.exports = mongoose.model('Plays', PlaySchema);
