'use strict';
module.exports = function(app) {
  var system = require('../controllers/systemController');

  app.route('/vaccum')
    .get(system.vaccum);
};
