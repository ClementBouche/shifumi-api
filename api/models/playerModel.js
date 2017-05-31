'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
  name: {
      type: String
  }
});

module.exports = mongoose.model('Players', playerSchema);
