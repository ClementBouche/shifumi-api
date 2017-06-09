'use strict';
module.exports = function(app) {
  var place = require('../controllers/placeController');

  app.route('/place')
    .get(place.list)
    .post(place.create);

  app.route('/place/:placeid')
    .get(place.read)
    .put(place.update)
    .delete(place.delete);
};
