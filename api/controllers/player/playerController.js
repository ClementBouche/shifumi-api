'use strict';

const mongoose = require('mongoose');

const Player = mongoose.model('Players');
const User = mongoose.model('Users');

const requestHelperService = require('../../services/requestHelperService');

const projection = {
  name: 1,
  user_id: 1,
  user: 1,
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
};

const userProjection = {
  username: 1,
  admin: 1,
  email: 1,
  library: 1
}

exports.list = function(req, res) {
  const size = requestHelperService.getQuerySize(req, 10);
  const page = requestHelperService.getQueryPage(req);
  const skip = page * size ;

  Player.find({}, null, {
    sort: { name: 1 },
    skip: skip,
    limit: size
  }, function(err, players) {
    if (err) return res.send(err);
    res.json(players);
  });
};

exports.create = function(req, res) {
  const new_player = new Player(req.body);
  new_player.save(function(err, player) {
    if (err) return res.send(err);
    res.json(player);
  });
};

exports.read = function(req, res) {
  Player.findById(req.params.playerid, projection)
    .exec((err, player) => {
      if (err || !player) return res.sendStatus(404);
      if (!player.user_id) return res.json(player);
      // conditional 'lookup' for user
      User.findById(player.user_id, userProjection).exec((err, user) => {
        if (err || !user) return res.json(player);
        // return merged player && user
        const result = Object.assign({}, player.toJSON(), {user: user.toJSON()});
        res.json(result);
      });
    });
};

exports.update = function(req, res) {
  Player.findOneAndUpdate(req.params.playerid, req.body, {
    new: true
  }, function(err, player) {
    if (err) return res.send(err);
    res.json(player);
  });
};


exports.delete = function(req, res) {
  Player.deleteOne({
    _id: req.params.playerid
  }, function(err, player) {
    if (err) return res.send(err);
    res.json({
      message: 'Player successfully deleted'
    });
  });
};


exports.search = function(req, res) {
  res.json({
    message: 'en cours de developpement'
  });
}


exports.search_by_id = function(req, res) {
  res.json({
    message: 'en cours de developpement'
  });
}
