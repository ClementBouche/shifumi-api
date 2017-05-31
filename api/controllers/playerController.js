'use strict';

var mongoose = require('mongoose');

var Player = mongoose.model('Players');

exports.list = function(req, res) {
  Player.find({}, function(err, player) {
    if (err)
      res.send(err);
    res.json(player);
  });
};

exports.create = function(req, res) {
  var new_player = new Player(req.body);
  new_player.save(function(err, player) {
    if (err)
      res.send(err);
    res.json(player);
  });
};


exports.read = function(req, res) {
  Player.findById(req.params.playerid, function(err, player) {
    if (err)
      res.send(err);
    res.json(player);
  });
};


exports.update = function(req, res) {
  Player.findOneAndUpdate(req.params.playerid, req.body, {
    new: true
  }, function(err, player) {
    if (err)
      res.send(err);
    res.json(player);
  });
};


exports.delete = function(req, res) {
  Player.remove({
    _id: req.params.playerid
  }, function(err, player) {
    if (err)
      res.send(err);
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
