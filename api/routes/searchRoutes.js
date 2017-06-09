'use strict';
module.exports = function(app) {
  var search = require('../controllers/searchController');

  app.route('/search/boardgame')
    .get(search.boardgames);

  app.route('/search/boardgame/:id')
    .get(search.boardgame_by_id);

  app.route('/search/play')
    .get(search.plays);

  app.route('/search/play/:id')
    .get(search.play_by_id);

  app.route('/vaccum')
    .get(search.vaccum);
};
