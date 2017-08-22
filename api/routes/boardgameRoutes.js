'use strict';

var tokenService = require('../jwt/tokenService');

module.exports = function(app) {
  var boardgame = require('../controllers/boardgameController');
  var boardgameSearch = require('../controllers/boardgameSearchController');
  var boardgameThematic = require('../controllers/boardgameThematicController');
  var boardgameMechanic = require('../controllers/boardgameMechanicController');

  app.route('/boardgame')
    .get(boardgame.list);

  app.route('/boardgame/mechanic')
    .get(boardgameMechanic.list);

  app.route('/boardgame/thematic')
    .get(boardgameThematic.list);

  app.route('/boardgame/:boardgameid')
    .get(boardgame.read);

  // route middleware to verify a token

  app.route('/boardgame')
    .post(tokenService.checkUser, boardgame.create);

  app.route('/boardgame/search')
    .post(tokenService.checkUser, boardgameSearch.create);

  app.route('/boardgame/:boardgameid')
    .put(tokenService.checkUser, boardgame.update)
    .delete(tokenService.checkUser, boardgame.delete);

};
