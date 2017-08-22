'use strict';

var tokenService = require('../jwt/tokenService');

module.exports = function(app) {
  var user = require('../controllers/userController');

  app.route('/user/authenticate')
    .post(user.authenticate);

  app.route('/user/setup')
    .get(tokenService.checkUser, user.setup);

  app.route('/user')
    .get(tokenService.checkUser, user.list);

  app.route('/user/:userid')
    .get(tokenService.checkUser, user.read)
    .post(tokenService.checkUser, user.update)
    .delete(tokenService.checkUser, user.delete);
};
