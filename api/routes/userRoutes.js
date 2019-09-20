'use strict';

const tokenService = require('../jwt/tokenService');

module.exports = function(app) {
  const user = require('../controllers/user/userController');
  const login = require('../controllers/user/loginController');
  const admin = require('../controllers/user/adminController');
  const boardgameSearch = require('../controllers/boardgame/boardgameSearchController');

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

  // public library

  app.route('/user/:userid/library')
    .get(user.library)
    .post(user.librarySearch, boardgameSearch.create);

};
