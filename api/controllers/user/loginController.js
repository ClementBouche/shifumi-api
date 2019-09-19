'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config  = require('../../../config'); // get our config file

var User = mongoose.model('Users');

exports.authenticate = function(req, res) {
  // find the user
  User.findOne({
    username: req.body.username
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a token
        var token = jwt.sign({
            id: user.id,
            username: user.username,
            admin: user.admin
          },
          config.secret,
          {
            expiresIn: "24h" // expires in 24 hours
          }
        );
        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          user: user,
        });
      }
    }
  });
};

exports.register = function(req, res) {
  var newUser = new User(req.body);
  newUser.activated = false;
  newUser.admin = false;
  newUser.save(function(err, user) {
    if (err) return res.send(err);
    res.json(user);
  });
};
