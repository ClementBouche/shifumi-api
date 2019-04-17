'use strict';

var mongoose = require('mongoose');

var Player = mongoose.model('Players');

const requestHelperService = require('../services/requestHelperService');

exports.list = function(req, res) {
  const size = requestHelperService.getSize(req, 10);
  const page = requestHelperService.getPage(req);
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
  var new_player = new Player(req.body);
  new_player.save(function(err, player) {
    if (err) return res.send(err);
    res.json(player);
  });
};


exports.read = function(req, res) {
  Player.findById(req.params.playerid, function(err, player) {
    if (err) return res.send(err);
    res.json(player);
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
  Player.remove({
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
