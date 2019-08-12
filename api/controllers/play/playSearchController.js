'use strict';

const mongoose = require('mongoose');
const Play = mongoose.model('Plays');
const Boardgame = mongoose.model('Boardgames');

const requestHelperService = require('../../services/requestHelperService');

const projection = {
  xmlapi_id: 1,
  date: 1,
  place_name: 1,
  thumbnail: 1,
  boardgame_id: 1,
  boardgame_name: 1,
  playing_time: 1,
  incomplete:1,
  scores:1
};

exports.search = function(req, res) {
  let size, page, skip, filters = {}, sort = {};
  // pages
  size = requestHelperService.getBodySize(req, 10);
  page = requestHelperService.getBodyPage(req);
  skip = page * size ;

  sort = {
    date: -1,
    _id: -1
  }

  // 1 // boardgame
  if (req.body.boardgame) {
    const boardgame = req.body.boardgame.trim();
    // filters['boardgame_name'] = new RegExp(boardgame, 'i');
    filters['boardgame_name'] = boardgame;
    sort['boardgame_name'] = 1;
  }
  // 2 // player name or id
  if (req.body.player) {
    const player = req.body.player.trim();
    // filters['scores.player_name'] = new RegExp(player, 'i');
    filters['scores.player_name'] = player;
  }

  const promiseA = Play.countDocuments(filters)
    .then((count) => {
      return count;
    });

  const promiseB = Play.find(filters, projection, {
      sort: sort,
      limit: size,
      skip: skip
    })
    .limit(size)
    .exec().then((result) => {
      return {
        size: size,
        page: req.body.page || 1,
        result: result
      }
    });

  Promise.all([promiseA, promiseB]).then(([count, json]) => {
    json.count = count;
    return res.json(json);
  });

};
