'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
  name: {
      type: String
  }
});

module.exports = mongoose.model('Locations', locationSchema);
