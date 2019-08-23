'use strict';

var tokenService = require('../jwt/tokenService');

module.exports = function(app) {
  var user = require('../controllers/user/userController');
  var login = require('../controllers/user/loginController');
  var admin = require('../controllers/user/adminController');

  // login controller

  app.route('/authenticate')
    .post(login.authenticate);

  app.route('/register')
    .post(login.register);

  // actions only on my account

  app.route('/me')
    .get(tokenService.checkUser, user.me)
    .post(tokenService.checkUser, user.updateMe);

  // user / admin controller

  app.route('/user')
    .get(tokenService.checkUser, user.list)
    .post(tokenService.checkAdmin, admin.create);

  app.route('/user/:userid')
    .get(tokenService.checkUser, user.read)
    .post(tokenService.checkAdmin, admin.update)
    .delete(tokenService.checkAdmin, admin.delete);

  app.route('/user/:userid/claim')
    .get(tokenService.checkAdmin, admin.claim);
};
