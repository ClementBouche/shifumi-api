'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BoardgameSchema = new Schema({
  objectid: {
    type: Number
  },
  year_published: {
    type: String
  },
  min_players: {
    type: Number
  },
  max_players: {
    type: Number
  },
  playing_time: {
    type: Number
  },
  min_play_time: {
    type: Number
  },
  max_play_time: {
    type: Number
  },
  age: {
    type: Number
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  thumbnail: {
    type: String
  },
  image: {
    type: String
  }
  // name: {
  //   type: String,
  //   Required: 'Kindly enter the name of the game'
  // },
  // created_date: {
  //   type: Date,
  //   default: Date.now
  // },
  // status: {
  //   type: [{
  //     type: String,
  //     enum: ['pending', 'ongoing', 'completed']
  //   }],
  //   default: ['pending']
  // }
});

module.exports = mongoose.model('Boardgames', BoardgameSchema);
