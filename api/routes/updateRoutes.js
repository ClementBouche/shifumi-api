'use strict';
module.exports = function(app) {
  var search = require('../controllers/updateController');

  app.route('/update/place')
    .get(search.update_place);

  app.route('/update/player')
    .get(search.update_player);
};
