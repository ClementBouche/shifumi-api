'use strict';

var config  = require('../../config'); // get our config file

exports.getPage = function(req) {
  return req.query && req.query.page ? parseInt(req.query.page) - 1 : 1;
}

exports.getSize = function(req, defaultSize = 10) {
  return req.query && req.query.size ? parseInt(req.query.size) : defaultSize;
}
