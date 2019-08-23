'use strict';

var tokenService = require('../jwt/tokenService');

module.exports = function(app) {
  var player = require('../controllers/player/playerController');
  var playerSearch = require('../controllers/player/playerSearchController');
  var statistic = require('../controllers/statisticController');

  // player controller
  app.route('/player')
    .get(player.list)
    .post(tokenService.checkUser, player.create);

  // player search controller
  
  app.route('/player/search')
    .post(playerSearch.create);

  // other controllers

  app.route('/player/:playerid/statistic')
    .get(statistic.player);

  // player id routes
  app.route('/player/:playerid')
    .get(player.read)
    .put(tokenService.checkUser, player.update)
    .delete(tokenService.checkAdmin, player.delete);

};
