'use strict';

const mongoose = require('mongoose');

const User = mongoose.model('Users');
const Boardgame = mongoose.model('Boardgames');

const UserService = require('../../services/user/userService');
const LibraryService = require('../../services/user/libraryService');

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

exports.library = function(req, res, next) {
  User.findById(req.params.userid)
    .exec()
    .then((user) => {
      let mode;
      if (req.body && req.body.library_mode && req.body.library_mode !== '') {
        mode = req.body.library_mode;
      }
      const library = LibraryService.filter(user.library, mode);
      res.json(library);
    });
}

exports.librarySearch = function(req, res, next) {
  User.findById(req.params.userid)
    .exec()
    .then((user) => {
      let mode;
      if (req.body && req.body.library_mode && req.body.library_mode !== '') {
        mode = req.body.library_mode;
      }
      const library = LibraryService.filter(user.library, mode);
      req.body.list_id = library.map((item) => item.boardgame_id);
      next();
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
