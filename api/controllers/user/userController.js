'use strict';

const mongoose = require('mongoose');

const User = mongoose.model('Users');
const Player = mongoose.model('Players');

const UserService = require('../../services/user/userService');
const LibraryService = require('../../services/user/libraryService');

const projection = {
  username: 1,
  admin: 1,
  player_ids_claimed: 1,
  library: 1
};

const listProjection = {
  username: 1,
  admin: 1,
  player_ids_claimed: 1,
};

const playerProjection = {
  name: 1,
  avatar_image: 1,
  // statistic
  boardgames_count: 1,
  plays_count: 1,
  plays_incomplete_count: 1,
  plays_win_count: 1,
  places_count: 1,
  players_count: 1,
  play_time: 1,
  win_ratio: 1,
  // avatar
  avatar_image: 1,
  color_primary: 1,
  color_accent: 1,
  color_text: 1,
}

exports.list = function(req, res) {
  User.find({}, listProjection, function(err, users) {
    if (err) return res.send(err);
    res.json(users);
  });
}

exports.read = function(req, res) {
  User.findById(req.params.userid, projection)
  .exec((err, user) => {
    if (err || !user) return res.sendStatus(404);
    // conditional 'lookup'
    const condition = { name: user.username };
    // TODO make it work
    // const condition = { user_id: user._id };
    // const condition = { user_id: mongoose.Types.ObjectId(user.id) };
    Player.findOne(condition, playerProjection)
      .exec((err, player) => {
        if (err || !player) return res.json(user);
        // return merged user && player
        const result = Object.assign({}, user.toJSON(), {player: player.toJSON()});
        res.json(result);
      });
  });
};

// me functions

exports.me = function(req, res, next) {
  req.params['userid'] = req.decoded.id;
  next();
  // User.findById(req.decoded.id, projection, function(err, user) {
  //   if (err) return res.send(err);
  //   res.json(user);
  // });
}

exports.library = function(req, res, next) {
  User.findById(req.params.userid, projection)
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
  User.findById(req.params.userid, projection)
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
