'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
  // metadata
  name: String,
  // account information
  user_id: Schema.Types.ObjectId,
  // avatar
  avatar_image: String,
  color_primary: String,
  color_accent: String,
  color_text: String,
  // global statistic data
  boardgames_count: { type: Number, default: 0 },
  plays_count: { type: Number, default: 0 },
  plays_incomplete_count: { type: Number, default: 0 },
  plays_win_count: { type: Number, default: 0 },
  places_count: { type: Number, default: 0 },
  players_count: { type: Number, default: 0 },
  play_time: { type: Number, default: 0 },
  win_ratio: { type: Number, default: 0 }
}, {
  strict: true
});

module.exports = mongoose.model('Players', playerSchema);
