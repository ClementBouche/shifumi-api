'use strict';

var mongoose = require('mongoose');

var Location = mongoose.model('Locations');

exports.list = function(req, res) {
  Location.find({}, function(err, location) {
    if (err)
      res.send(err);
    res.json(location);
  });
};

exports.create = function(req, res) {
  var new_location = new Location(req.body);
  new_location.save(function(err, location) {
    if (err)
      res.send(err);
    res.json(location);
  });
};


exports.read = function(req, res) {
  Location.findById(req.params.locationid, function(err, location) {
    if (err)
      res.send(err);
    res.json(location);
  });
};


exports.update = function(req, res) {
  Location.findOneAndUpdate(req.params.locationid, req.body, {
    new: true
  }, function(err, location) {
    if (err)
      res.send(err);
    res.json(location);
  });
};


exports.delete = function(req, res) {
  Location.remove({
    _id: req.params.locationid
  }, function(err, location) {
    if (err)
      res.send(err);
    res.json({
      message: 'Location successfully deleted'
    });
  });
};


exports.search = function(req, res) {
  res.json({
    message: 'en cours de developpement'
  });
}


exports.search_by_id = function(req, res) {
  res.json({
    message: 'en cours de developpement'
  });
}
