'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config  = require('./../../config'); // get our config file

var User = mongoose.model('Users');

exports.list = function(req, res) {
  const projection = {
    username: 1,
    email: 1,
    admin: 1
  };
  User.find({}, projection, function(err, users) {
    if (err) return res.send(err);
    res.json(users);
  });
}

exports.create = function(req, res) {
  var new_user = new User(req.body);
  new_user.save(function(err, user) {
    if (err) return res.send(err);
    res.json(user);
  });
}

exports.read = function(req, res) {
  User.findById(req.params.userid, function(err, user) {
    if (err) return res.send(err);
    res.json(user);
  });
};

exports.update = function(req, res) {
  User.findOneAndUpdate(req.params.userid, req.body, {
    new: true
  }, function(err, user) {
    if (err) return res.send(err);
    res.json(user);
  });
};

exports.delete = function(req, res) {
  User.remove({
    _id: req.params.userid
  }, function(err, user) {
    if (err) return res.send(err);
    res.json({
      message: 'User successfully deleted'
    });
  });
};

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
          id: user.id,
          username: user.username
        });
      }   
    }
  });
};
