'use strict';
module.exports = function(app) {
  var boardgame = require('../controllers/boardgameController');
  var boardgameSearch = require('../controllers/boardgameSearchController');
  var boardgameThematic = require('../controllers/boardgameThematicController');
  var boardgameMechanic = require('../controllers/boardgameMechanicController');

  app.route('/boardgame')
    .get(boardgame.list)
    .post(boardgame.create);

  app.route('/boardgame/mechanic')
    .get(boardgameMechanic.list);

  app.route('/boardgame/thematic')
    .get(boardgameThematic.list);

  app.route('/boardgame/search')
    .post(boardgameSearch.create);

  app.route('/boardgame/:boardgameid')
    .get(boardgame.read)
    .put(boardgame.update)
    .delete(boardgame.delete);

};
