'use strict';

var tokenService = require('../jwt/tokenService');

module.exports = function(app) {
  var player = require('../controllers/playerController');
  var statistic = require('../controllers/statisticController');

  app.route('/player')
    .get(player.list)
    .post(tokenService.checkUser, player.create);

  app.route('/player/statistic')
    .get(statistic.player);

  app.route('/player/:playerid')
    .get(player.read)
    .put(tokenService.checkUser, player.update)
    .delete(tokenService.checkUser, player.delete);
};
