'use strict';

var tokenService = require('../jwt/tokenService');

module.exports = function(app) {
  var search = require('../controllers/updateController');

  app.route('/update/place')
    .get(tokenService.checkUser, search.update_place);

  app.route('/update/player')
    .get(tokenService.checkUser, search.update_player);

  app.route('/update/boardgame')
    .get(tokenService.checkUser, search.update_boardgame);
};
