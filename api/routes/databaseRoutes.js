'use strict';
module.exports = function(app) {
  var database = require('../controllers/databaseController');

  app.route('/database/boardgame')
    .get(database.boardgames);

  app.route('/database/boardgame/:id')
    .get(database.boardgame_by_id);

  app.route('/database/play')
    .get(database.plays);
};
