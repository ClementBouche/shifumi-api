'use strict';

const mongoose = require('mongoose');
const Play = mongoose.model('Plays');

const requestHelperService = require('../services/requestHelperService');

exports.list = function(req, res) {
  const size = requestHelperService.getSize(req, 10);
  const page = requestHelperService.getPage(req);
  const skip = page * size ;

  Play.getPaginatedPlays({}, skip, size, function(err, plays) {
    if(err) {
      res.send(err);
    }
    res.json(plays);
  })
};

exports.search = function(req, res) {
  const condition = {};
  if (req.body && req.body.boardgame) {
    condition['boardgame_name'] = req.body.boardgame
  }

  Play.getPaginatedPlays(condition, 0, null, function(err, plays) {
    if(err) {
      res.send(err);
    }
    res.json(plays);
  })
};

exports.create = function(req, res) {
  const new_boargame = new Play(req.body);
  new_boargame.save(function(err, play) {
    if (err)
      res.send(err);
    res.json(play);
  });
};


exports.read = function(req, res) {
  Play.findById(req.params.playid, function(err, play) {
    if (err)
      res.send(err);
    res.json(play);
  });
};


exports.update = function(req, res) {
  Play.findOneAndUpdate(req.params.playid, req.body, {
    new: true
  }, function(err, play) {
    if (err)
      res.send(err);
    res.json(play);
  });
};


exports.delete = function(req, res) {
  Play.remove({
    _id: req.params.playid
  }, function(err, play) {
    if (err)
      res.send(err);
    res.json({
      message: 'Play successfully deleted'
    });
  });
};


Play.getPaginatedPlays = function(condition, skip, limit, callback) {
  Play.find(condition, null, {
      sort: { date: -1 },
      skip: skip,
      limit: limit
    },
    function(err, results) {
      callback(err, results);
    }
  );
}



