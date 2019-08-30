'use strict';

const mongoose = require('mongoose');

const User = mongoose.model('Users');

const UserService = require('../../services/user/userService');

exports.list = function(req, res) {
  const projection = {
    username: 1,
    admin: 1,
    player_ids_claimed: 1,
  };
  User.find({}, projection, function(err, users) {
    if (err) return res.send(err);
    res.json(users);
  });
}

exports.read = function(req, res) {
  User.findById(req.params.userid, function(err, user) {
    if (err) return res.send(err);
    res.json(user);
  });
};

// me functions

exports.me = function(req, res) {
  User.findById(req.decoded.id, function(err, user) {
    if (err) return res.send(err);
    res.json(user);
  });
}

exports.updateMe = function(req, res) {
  User.findById(req.decoded.id)
    .exec()
    .then((user) => {
      const newUser = Object.assign(user, req.body);
      newUser.admin = user.admin;
      return newUser.save();
    })
    .then((user) => {
      // TODO update player && plays
      UserService.renameUser(user, user.username);
      return user;
    })
    .then((user) => {
      res.json(user);
    });
};
