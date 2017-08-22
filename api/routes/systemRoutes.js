'use strict';

var tokenService = require('../jwt/tokenService');

module.exports = function(app) {
  var system = require('../controllers/systemController');

  app.route('/vaccum')
    .get(tokenService.checkAdmin, system.vaccum);
};
