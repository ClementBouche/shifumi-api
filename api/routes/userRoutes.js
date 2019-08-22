'use strict';

var tokenService = require('../jwt/tokenService');

module.exports = function(app) {
  var user = require('../controllers/user/userController');
  var login = require('../controllers/user/loginController');
  var admin = require('../controllers/user/adminController');

  // login controller

  app.route('/user/authenticate')
    .post(login.authenticate);

  app.route('/user/register')
    .post(login.register);

  // user controller

  app.route('/user')
    .get(tokenService.checkUser, user.list);

  app.route('/user/:userid')
    .get(tokenService.checkUser, user.read);

  // actions only on my account

  app.route('/user/update')
    .get(tokenService.checkUser, user.checkMyself, user.update);

  app.route('/user/:userid/claim')
    .post(tokenService.checkUser, user.checkMyself, user.claim);

  // admin controller

  app.route('/user')
    .post(tokenService.checkAdmin, admin.create);

  app.route('/user/:userid')
    .post(tokenService.checkAdmin, user.update)
    .delete(tokenService.checkAdmin, admin.delete);

  app.route('/user/:userid/valid')
    .post(tokenService.checkAdmin, admin.claim);
};
