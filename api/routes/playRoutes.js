'use strict';
module.exports = function(app) {
  var play = require('../controllers/playController');

  app.route('/play')
    .get(play.list)
    .post(play.create);

  app.route('/play/:playid')
    .get(play.read)
    .put(play.update)
    .delete(play.delete);

  app.route('/play-search')
    .get(play.search);

  app.route('/play-search/:id')
    .get(play.search_by_id);
};
