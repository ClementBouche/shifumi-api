'use strict';
//https://www.boardgamegeek.com/xmlapi2/plays?username=cbouche
var mongoose = require('mongoose');

var Player = mongoose.model('Players');

const requestHelperService = require('../../services/requestHelperService');

const projection = {
  name: 1,
  have_account: 1,
  // pour affichage
  boardgames_count: 1,
  avatar_image: 1,
  avatar_color: 1,
  plays_count: 1,
  plays_incomplete_count: 1,
  plays_win_count: 1,
  places_count: 1,
  players_count:1,
  play_time:1,
  win_ratio:1
};

exports.create = function(req, res) {
  let size, page, skip, name, filters = {};
  // pages
  page = requestHelperService.getBodyPage(req);
  size = requestHelperService.getBodySize(req, 100);
  skip = page * size ;

  // 1 // name
  if (req.body.name) {
    name = req.body.name.trim();
    filters.name = new RegExp(name, 'i');
  }

  const promiseA = Player.countDocuments(filters)
    .then((count) => {
      return count;
    });

  const promiseB = Player.find(filters, projection, {
      sort: { name: filters.name ? 1 : 0 },
      limit: size,
      skip: skip
    })
    .limit(size)
    .exec().then((players) => {
      return {
        size: size,
        page: page,
        result: players
      }
    });

    Promise.all([promiseA, promiseB]).then(([count, json]) => {
      json.count = count;
      return res.json(json);
    })

};
