'use strict';

var tokenService = require('../jwt/tokenService');

module.exports = function(app) {
  var boardgame = require('../controllers/boardgame/boardgameController');
  var boardgameSearch = require('../controllers/boardgame/boardgameSearchController');
  var boardgameThematic = require('../controllers/boardgameThematicController');
  var boardgameMechanic = require('../controllers/boardgameMechanicController');
  var boardgameSubdomain = require('../controllers/boardgameSubdomainController');
  var statistic = require('../controllers/statisticController');

  // other controllers

  app.route('/mechanic')
    .get(boardgameMechanic.list);

  app.route('/thematic')
    .get(boardgameThematic.list);

  app.route('/subdomain')
    .get(boardgameSubdomain.list);

  // boardgame controller

  app.route('/boardgame')
    .get(boardgame.list)
    .post(tokenService.checkUser, boardgame.create);

  app.route('/boardgame/:boardgameid/statistic')
    .get(statistic.boardgame);

  app.route('/boardgame/search')
    .post(boardgameSearch.create);

  app.route('/boardgame/:boardgameid')
    .get(boardgame.read)
    .put(tokenService.checkUser, boardgame.update)
    .delete(tokenService.checkUser, boardgame.delete);
};
