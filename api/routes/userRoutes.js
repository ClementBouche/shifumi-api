'use strict';

var tokenService = require('../jwt/tokenService');

module.exports = function(app) {
  var user = require('../controllers/userController');

  app.route('/user/authenticate')
    .post(user.authenticate);

  // route middleware to verify a token
  // app.use(tokenService.checkAuthentication);

  app.route('/user/setup')
    .get(user.setup);

  app.route('/user')
    .get(user.list);

  app.route('/user/:userid')
    .get(user.read)
    .post(user.update)
    .delete(user.delete);
};
