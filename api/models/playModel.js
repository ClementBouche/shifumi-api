'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaySchema = new Schema({
  xmlapi_id: {
    type: Number
  },
  date: {
    type: String
  },
  place_name: {
    type: String
  },
  boardgame_id: {
    type: String
  },
  boardgame_name: {
    type: String
  },
  playing_time: {
    type: Number
  },
  incomplete: {
    type: Boolean
  },
  thumbnail: { type: String },
  image: { type: String },
  scores: [{
    player_name: {
      type: String
    },
    score: {
      type: Number
    },
    win: {
      type: Boolean
    },
    new: {
      type: Boolean
    }
  }],
  comments: [{
    player_name: {type: String},
    title: {type: String},
    content: {type: String}
  }]
});

module.exports = mongoose.model('Plays', PlaySchema);
