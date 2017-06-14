'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BoardgameSchema = new Schema({
  // xml api info
  xmlapi_id: { type: Number },
  // metadata
  name: { type: String },
  description: { type: String },
  year_published: { type: String },
  // images
  thumbnail: { type: String },
  image: { type: String },
  // game information
  min_players: { type: Number },
  max_players: { type: Number },
  playing_time: { type: Number },
  min_play_time: { type: Number },
  max_play_time: { type: Number },
  age: { type: Number },
  // advance information
  subdomain: { type: String },
  thematics: [{ type: String }],
  mechanics: [{ type: String }],
  // people information
  artists: [{
    xmlapi_id: { type: Number },
    name: { type: String }
  }],
  designers: [{
    xmlapi_id: { type: Number },
    name: { type: String }
  }],
  // community information
  suggested_players: {
    votes: { type: Number },
    poll: [{
      player_count: { type: String },
      best: { type: Number },
      recommanded: { type: Number },
      not_recommanded: { type: Number }
    }]
  },
  // global statistic data
  plays_count: { type: Number, default: 0 },
  plays_incomplete_count: { type: Number, default: 0 },
  places_count: { type: Number, default: 0 },
  players_count: { type: Number, default: 0 },
  play_time: { type: Number, default: 0 }
});

module.exports = mongoose.model('Boardgames', BoardgameSchema);
