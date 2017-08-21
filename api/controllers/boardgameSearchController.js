'use strict';
//https://www.boardgamegeek.com/xmlapi2/plays?username=cbouche
var mongoose = require('mongoose');

var Boardgame = mongoose.model('Boardgames');

exports.create = function(req, res) {
  var size, page, name, filters = {};
  // pages
  req.body.size ? size = parseInt(req.body.size) : size = 100 ;
  req.body.page ? page = parseInt(req.body.page) - 1 : page = 1 ;
  var skip = page * size ;

  // 1 // name
  if (req.body.name) {
    name = req.body.name.trim();
    filters.name = new RegExp(name, 'i');
  }
  // 2 // players
  if (req.body.filters.min_players) {
    filters.min_players = {$gte: req.body.filters.min_players};
  }
  if (req.body.filters.max_players) {
    filters.max_players = {$lte: req.body.filters.max_players};
  }
  // 3 // time
  if (req.body.filters.min_time || req.body.filters.max_time) {
    filters.playing_time = {
      $gte: req.body.filters.min_time ? req.body.filters.min_time : 0,
      $lte: req.body.filters.max_time ? req.body.filters.max_time : 9999
    };
  }
  // 4 // mechanics
  if (req.body.filters.mechanics) {
    filters.mechanics = {$in: req.body.filters.mechanics}
  }
  // 5 // thematics
  if (req.body.filters.thematics) {
    filters.thematics = {$in: req.body.filters.thematics}
  }

  Boardgame.getPaginated(size, skip, filters, function(err, boardgames) {
    if (err)
      res.send(err);
    res.json(boardgames);
 });
};


Boardgame.getPaginated = function(limit, skip, filters, callback) {
  Boardgame.find(
    filters,
    {
      name: 1,
      min_players: 1,
      max_players: 1,
      playing_time: 1,
      mechanics: 1,
      thematics: 1,
      // pour affichage
      year_published:1,
      thumbnail:1,
      plays_count:1,
      play_time:1
    },
    {
      // sort: { rank: 1 },
      sort: { name: 1 },
      skip: skip,
      limit: limit
    },
    function(err, results) {
      callback(err, results);
    }
  );
}
