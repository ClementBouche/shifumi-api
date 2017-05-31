'use strict';
module.exports = function(app) {
  var location = require('../controllers/locationController');

  app.route('/location')
    .get(location.list)
    .post(location.create);

  app.route('/location/:locationid')
    .get(location.read)
    .put(location.update)
    .delete(location.delete);

  app.route('/search/location')
    .get(location.search);

  app.route('/search/location/:id')
    .get(location.search_by_id);
};
