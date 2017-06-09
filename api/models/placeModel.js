'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placeSchema = new Schema({
  name: {
      type: String
  }
});

module.exports = mongoose.model('Places', placeSchema);
