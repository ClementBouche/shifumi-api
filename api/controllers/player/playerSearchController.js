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
  avatar_colors: 1,
  plays_count: 1,
  plays_incomplete_count: 1,
  plays_win_count: 1,
  places_count: 1,
  players_count:1,
  play_time:1,
  win_ratio:1
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.create = function(req, res) {
  let size, page, skip, name, userid, sort = {}, filters = {};
  // pages
  page = requestHelperService.getBodyPage(req);
  size = requestHelperService.getBodySize(req, 100);
  skip = page * size ;

  // 1 // name
  if (req.body.name) {
    name = decodeURI(escapeRegExp(req.body.name)).trim();
    filters.name = new RegExp(name, 'i');
  }
  if (req.body.user_id) {
    userid = decodeURI(escapeRegExp(req.body.user_id)).trim();
    filters.user_id = userid;
  }
  if (req.body.minPlay) {
    filters.plays_count = {$gte: req.body.minPlay};
  }

  if(req.body.order === 'name') sort['name'] = 1;
  if(req.body.order === 'play') sort['plays_count'] = -1;
  if(req.body.order === 'win') sort['win_ratio'] = -1;

  const promiseA = Player.countDocuments(filters)
    .then((count) => {
      return count;
    });

  const promiseB = Player.find(filters, projection, {
      sort: sort,
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
