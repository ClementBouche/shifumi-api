'use strict';
module.exports = function(app) {
  var boardgame = require('../controllers/boardgameController');

  app.route('/boardgame')
    .get(boardgame.list)
    .post(boardgame.create);

  app.route('/boardgame/:boardgameid')
    .get(boardgame.read)
    .put(boardgame.update)
    .delete(boardgame.delete);

  app.route('/search')
    .get(boardgame.search);

  app.route('/search/:id')
    .get(boardgame.search_by_id);
};
