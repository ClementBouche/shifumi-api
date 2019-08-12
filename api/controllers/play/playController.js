'use strict';

const mongoose = require('mongoose');
const Play = mongoose.model('Plays');
const Boardgame = mongoose.model('Boardgames');

const requestHelperService = require('../../services/requestHelperService');

exports.list = function(req, res) {
  const size = requestHelperService.getQuerySize(req, 10);
  const page = requestHelperService.getQueryPage(req);
  const skip = page * size ;

  Play.getPaginatedPlays({}, skip, size, function(err, plays) {
    if (err) return res.send(err);
    res.json(plays);
  })
};


exports.create = function(req, res) {
  const new_play = new Play(req.body);
  // look for boardgame id
  Boardgame.findOne({
    name: new_play.boardgame_name
  }, function(err, boardgame) {
    const id = boardgame && boardgame._id ? boardgame._id : '';
    new_play.boardgame_id = id;

    const thumbnail = boardgame && boardgame.thumbnail ? boardgame.thumbnail : '';
    new_play.thumbnail = thumbnail;

    new_play.save(function(err, play) {
      if (err) return res.send(err);
      res.json(play);
    });
  });
};


exports.read = function(req, res) {
  Play.findById(req.params.playid, function(err, play) {
    if (err) return res.sendStatus(404);
    res.json(play);
  });
};


exports.update = function(req, res) {
  Play.findById(req.params.playid, {
    new: true
  }, function(err, play) {
    if (err) return res.send(err);
    // should this do the trick?
    const new_play = Object.assign(play, req.body);
    new_play.save(function(err, play) {
      if (err) return res.send(err);
      res.json(play);
    });
  });
};


exports.delete = function(req, res) {
  Play.deleteOne({
    _id: req.params.playid
  }, function(err, play) {
    if (err) return res.send(err);
    res.json({
      message: 'Play successfully deleted'
    });
  });
};


Play.getPaginatedPlays = function(condition, skip, limit, callback) {
  Play.find(condition, null, {
      sort: { date: -1, _id: -1 },
      skip: skip,
      limit: limit
    },
    function(err, results) {
      callback(err, results);
    }
  );
}
