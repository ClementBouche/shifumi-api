'use strict';

var tokenService = require('../jwt/tokenService');

module.exports = function(app) {
  var place = require('../controllers/placeController');
  var statistic = require('../controllers/statisticController');

  app.route('/place')
    .get(place.list)
    .post(tokenService.checkUser, place.create);

  app.route('/place/statistic')
    .get(statistic.place);

  app.route('/place/:placeid')
    .get(place.read)
    .put(tokenService.checkUser, place.update)
    .delete(tokenService.checkAdmin, place.delete);
};
