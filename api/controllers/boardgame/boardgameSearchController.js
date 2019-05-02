'use strict';
//https://www.boardgamegeek.com/xmlapi2/plays?username=cbouche
var mongoose = require('mongoose');

var Boardgame = mongoose.model('Boardgames');

const requestHelperService = require('../../services/requestHelperService');

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
  let size, page, skip, name, filters = {};
  // pages
  size = requestHelperService.getBodySize(req, 10);
  page = requestHelperService.getBodyPage(req);
  skip = page * size ;

  // 0 rank filter (to hide extension)
  filters.rank = {$ne: 0, $ne: null};

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
      $lte: req.body.max_time ? req.body.max_time : 9999,
      $ne: 0
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

  const promiseA = Boardgame.countDocuments(filters)
    .then((count) => {
      return count;
    });

  const promiseB = Boardgame.find(filters, projection, {
      sort: { rank: 1, name: filters.name ? 1 : 0 },
      limit: size,
      skip: skip
    })
    .limit(size)
    .exec().then((boardgames) => {
      return {
        size: size,
        page: req.body.page || 1,
        result: boardgames
      }
    });

    Promise.all([promiseA, promiseB]).then(([count, json]) => {
      json.count = count;
      return res.json(json);
    })

};
