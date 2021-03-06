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
  bayes_note: 1,
  average_note: 1,
  votes_note: 1,
  complexity: 1,
  votes_complexity: 1,
  subdomain: 1,
};

exports.create = function(req, res) {
  let size, page, skip, name, filters = {}, sort = {};
  // pages
  size = requestHelperService.getBodySize(req, 10);
  page = requestHelperService.getBodyPage(req);
  skip = page * size ;

  // 0 rank filter (to hide extension)
  filters.rank = {$ne: 0, $ne: null};

  // 1 name
  if (req.body.name) {
    name = req.body.name.trim();
    filters.name = new RegExp(name, 'i');
  }
  // 2 players
  if (req.body.min_players || req.body.max_players) {
    const min = req.body.min_players ? req.body.min_players : 0;
    const max = req.body.max_players ? req.body.max_players : 0;
    filters['min_players'] = { $gte: min };
    filters['max_players'] = { $lte: max };
  }
  // 3 time
  if (req.body.min_time || req.body.max_time) {
    filters.playing_time = {
      $gte: req.body.min_time ? req.body.min_time : 0,
      $lte: req.body.max_time ? req.body.max_time : 9999,
      $ne: 0
    };
  }
  // 4 mechanics
  if (req.body.mechanics && req.body.mechanics.length > 0) {
    filters.mechanics = {$all: req.body.mechanics};
  }
  // 5 mechanics
  if (req.body.thematics && req.body.thematics.length > 0) {
    filters.thematics = {$all: req.body.thematics};
  }
  // 6 designer
  if (req.body.people_name) {
    const name = req.body.people_name.trim();
    filters['$or'] = [
      { 'designers.name': new RegExp(name, 'i') },
      { 'artists.name': new RegExp(name, 'i') },
    ];
    projection.designers = 1;
    projection.artists = 1;
  }

  // 7 list id
  if (req.body.list_id) {
    filters['_id'] = {
      '$in': req.body.list_id
    }
  }

  // sort
  if (req.body.order_by) {
    sort[req.body.order_by] = req.body.order || 1;
  } else {
    sort = { rank: 1, name: filters.name ? 1 : 0 };
  }

  const promiseA = Boardgame.countDocuments(filters)
    .then((count) => {
      return count;
    });

  const promiseB = Boardgame.find(filters, projection, {
      sort: sort,
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
  });

};
