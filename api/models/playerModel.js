'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
  // metadata
  name: {
      type: String
  },
  have_account: {
    type: Boolean,
    default: false
  },
  // global statistic data
  boardgames_count: { type: Number, default: 0 },
  plays_count: { type: Number, default: 0 },
  plays_incomplete_count: { type: Number, default: 0 },
  plays_win_count: { type: Number, default: 0 },
  places_count: { type: Number, default: 0 },
  players_count: { type: Number, default: 0 },
  play_time: { type: Number, default: 0 },
  win_ratio: { type: Number, default: 0 }
});

module.exports = mongoose.model('Players', playerSchema);
