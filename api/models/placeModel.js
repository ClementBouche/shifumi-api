'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placeSchema = new Schema({
  // metadata
  name: {
    type: String
  },
  coordinates: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    }
  },
  // global statistic data
  boardgames_count: { type: Number, default: 0 },
  plays_count: { type: Number, default: 0 },
  plays_incomplete_count: { type: Number, default: 0 },
  players_count: { type: Number, default: 0 },
  play_time: { type: Number, default: 0 }
});

module.exports = mongoose.model('Places', placeSchema);
