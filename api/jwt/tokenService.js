'use strict';

var config  = require('./../../config'); // get our config file
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.checkUser = function(req, res, next) {
  if(req.headers 
    && req.headers.authorization 
    && req.headers.authorization.indexOf('Bearer') !== -1
  ) {
    var token = req.headers.authorization.split(' ')[1];
    if(token) {
      // verifies secret and checks exp
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {
      // if there is no token
      // return an error
      return res.status(403).send({
          success: false, 
          message: 'Unreadeable token.' 
      });
    }
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        success: false, 
        message: 'No token provided.' 
    });
  }
}

exports.checkAdmin = function(req, res, next) {
  if(req.headers 
    && req.headers.authorization 
    && req.headers.authorization.indexOf('Bearer') !== -1
  ) {
    var token = req.headers.authorization.split(' ')[1];
    if(token) {
      // verifies secret and checks exp
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          if(decoded.admin) {
            req.decoded = decoded;
            next();
          } else {
            // return an error
            return res.status(403).send({
                success: false, 
                message: 'You are not admin.' 
            });
          }
        }
      });
    } else {
      // return an error
      return res.status(403).send({
          success: false, 
          message: 'Unreadeable token.' 
      });
    }
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        success: false, 
        message: 'No token provided.' 
    });
  }
}
