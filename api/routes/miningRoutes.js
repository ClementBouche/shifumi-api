'use strict';
module.exports = function(app) {
  var mining = require('../controllers/miningController');

  app.route('/mining/boardgame')
    .get(mining.boardgames);

  app.route('/mining/boardgame/:id')
    .get(mining.boardgame_by_id);

  app.route('/mining/play')
    .get(mining.plays);

  app.route('/mining/play/:id')
    .get(mining.play_by_id);
};
