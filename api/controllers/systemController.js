'use strict';

var mongoose = require('mongoose');

var Boardgame = mongoose.model('Boardgames');
var Play = mongoose.model('Plays');
var Player = mongoose.model('Players');
var Place = mongoose.model('Places');

exports.vaccum = function(req, res) {
  Boardgame.remove({}, function(err, play) {
    if (err) return res.send(err);
  });
  Play.remove({}, function(err, play) {
    if (err) return res.send(err);
  });
  Player.remove({}, function(err, play) {
    if (err) return res.send(err);
  });
  Place.remove({}, function(err, play) {
    if (err) return res.send(err);
  });
  res.json({
    message: "Base de données vide"
  });
}
