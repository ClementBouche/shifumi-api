'use strict';
//https://www.boardgamegeek.com/xmlapi2/plays?username=cbouche
var mongoose = require('mongoose');

var Boardgame = mongoose.model('Boardgames');

exports.list = function(req, res) {
  Boardgame.find({}, function(err, boardgame) {
    if (err)
      res.send(err);
    res.json(boardgame);
  });
};


exports.create = function(req, res) {
  var new_boargame = new Boardgame(req.body);
  new_boargame.save(function(err, boardgame) {
    if (err)
      res.send(err);
    res.json(boardgame);
  });
};


exports.read = function(req, res) {
  Boardgame.findById(req.params.boardgameid, function(err, boardgame) {
    if (err)
      res.send(err);
    res.json(boardgame);
  });
};


exports.update = function(req, res) {
  Boardgame.findOneAndUpdate(req.params.boardgameid, req.body, {
    new: true
  }, function(err, boardgame) {
    if (err)
      res.send(err);
    res.json(boardgame);
  });
};


exports.delete = function(req, res) {
  Boardgame.remove({
    _id: req.params.boardgameid
  }, function(err, boardgame) {
    if (err)
      res.send(err);
    res.json({
      message: 'Boardgame successfully deleted'
    });
  });
};
