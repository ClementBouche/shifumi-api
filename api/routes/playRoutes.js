'use strict';

var tokenService = require('../jwt/tokenService');

module.exports = function(app) {
  var play = require('../controllers/play/playController');

  app.route('/play')
    .get(play.list)
    .post(tokenService.checkUser, play.create);

  app.route('/play/search')
    .post(play.search);

  app.route('/play/:playid')
    .get(play.read)
    .put(tokenService.checkUser, play.update)
    .delete(tokenService.checkUser, play.delete);
};
