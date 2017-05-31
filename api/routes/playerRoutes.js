'use strict';
module.exports = function(app) {
  var player = require('../controllers/playerController');

  app.route('/player')
    .get(player.list)
    .post(player.create);

  app.route('/player/:playerid')
    .get(player.read)
    .put(player.update)
    .delete(player.delete);

  app.route('/search/player')
    .get(player.search);

  app.route('/search/player/:id')
    .get(player.search_by_id);
};
