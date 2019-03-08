'use strict';
//https://www.boardgamegeek.com/xmlapi2/plays?username=cbouche
var mongoose = require('mongoose');

var Boardgame = mongoose.model('Boardgames');

const projection = {
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
  // if (req.body.players) {
  //   filters.min_players = {$gte: req.body.players};
  // }
  // if (req.body.players) {
  //   filters.max_players = {$lte: req.body.players};
  // }
  // 3 // time
  if (req.body.min_time || req.body.max_time) {
    filters.playing_time = {
      $gte: req.body.min_time ? req.body.min_time : 0,
      $lte: req.body.max_time ? req.body.max_time : 9999
    };
  }
  // 4 // mechanics
  if (req.body.mechanics) {
    filters.mechanics = {$in: req.body.mechanics}
  }
  // 5 // mechanics
  if (req.body.mechanics) {
    filters.thematics = {$in: req.body.thematics}
  }

  Boardgame.find(filters, projection, {
      sort: { rank: 1, name: 1 }
    })
    .limit(size)
    .exec().then((boardgames) => {
      res.json(boardgames);
    });

};
