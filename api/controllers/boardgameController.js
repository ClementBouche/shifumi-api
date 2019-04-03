'use strict';

var mongoose = require('mongoose');

var Boardgame = mongoose.model('Boardgames');

exports.list = function(req, res) {
  var size = 500 ;
  if (req.query.size) {
    size = parseInt(req.query.size);
  }
  var page = 0 ;
  if (req.query.page) {
    page = parseInt(req.query.page) - 1;
  }
  var skip = page * size ;

  var options = {
    sort: { rank: 1 },
    skip: skip,
    limit: size
  };

  var filters = {
    rank: {$ne: 0, $ne: null}
  };
  if(req.query.name) {
    filters.name = new RegExp(req.query.name.trim(), 'i');
    options.sort = { name: 1 };
  }
  if(req.query.sort) {
    options.sort = {};
    options.sort[req.query.sort] = 1;
  }
  var projection = {
    name: 1,
    min_players: 1,
    max_players: 1,
    playing_time: 1,
    mechanics: 1,
    thematics: 1,
    // pour affichage
    xmlapi_id: 1,
    year_published:1,
    thumbnail:1,
    plays_count:1,
    play_time:1,
    rank: 1,
    subdomain: 1
  };
  Boardgame.find(filters, projection, options, function(err, boardgame) {
    if (err) return res.send(err);
    res.json(boardgame);
  });
};


exports.create = function(req, res) {
  var new_boargame = new Boardgame(req.body);
  new_boargame.save(function(err, boardgame) {
    if (err) return res.send(err);
    res.json(boardgame);
  });
};


exports.read = function(req, res) {
  Boardgame.findById(req.params.boardgameid, function(err, boardgame) {
    if (err) return res.send(err);
    res.json(boardgame);
  });
};


exports.update = function(req, res) {
  Boardgame.findOneAndUpdate(req.params.boardgameid, req.body, {
    new: true
  }, function(err, boardgame) {
    if (err) return res.send(err);
    res.json(boardgame);
  });
};


exports.delete = function(req, res) {
  Boardgame.remove({
    _id: req.params.boardgameid
  }, function(err, boardgame) {
    if (err) return res.send(err);
    res.json({
      message: 'Boardgame successfully deleted'
    });
  });
};
