'use strict';

var config  = require('../../config'); // get our config file

exports.getQueryPage = function(req) {
  return req.query && req.query.page ? parseInt(req.query.page) - 1 : 1;
}

exports.getQuerySize = function(req, defaultSize = 10) {
  return req.query && req.query.size ? parseInt(req.query.size) : defaultSize;
}

exports.getBodyPage = function(req) {
  return req.body && req.body.page ? parseInt(req.body.page) - 1 : 1;
}

exports.getBodySize = function(req, defaultSize = 10) {
  return req.body && req.body.size ? parseInt(req.body.size) : defaultSize;
}
