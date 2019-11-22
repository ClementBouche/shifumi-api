'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaySchema = new Schema({
  // boardgame geek reference
  xmlapi_id: { type: Number },
  // boardgame reference
  boardgame_id: Schema.Types.ObjectId,
  // boardgame_name: { type: String },
  // thumbnail: { type: String },
  // image: { type: String },
  // place reference
  place_name: { type: String },
  // proper data
  date: { type: String },
  playing_time: { type: Number },
  incomplete: { type: Boolean },
  scores: [{
    // player reference
    player_id: Schema.Types.ObjectId,
    // player_name: String,
    score: Number,
    win: Boolean,
    new: Boolean,
    role: String,
    team: String
  }]
}, {
  strict: true
});

module.exports = mongoose.model('Plays', PlaySchema);
