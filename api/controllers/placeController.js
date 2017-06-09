'use strict';

var mongoose = require('mongoose');

var Place = mongoose.model('Places');

exports.list = function(req, res) {
  Place.find({}, function(err, place) {
    if (err)
      res.send(err);
    res.json(place);
  });
};

exports.create = function(req, res) {
  var new_place = new Place(req.body);
  new_place.save(function(err, place) {
    if (err)
      res.send(err);
    res.json(place);
  });
};


exports.read = function(req, res) {
  Place.findById(req.params.placeid, function(err, place) {
    if (err)
      res.send(err);
    res.json(place);
  });
};


exports.update = function(req, res) {
  Place.findOneAndUpdate(req.params.placeid, req.body, {
    new: true
  }, function(err, place) {
    if (err)
      res.send(err);
    res.json(place);
  });
};


exports.delete = function(req, res) {
  Place.remove({
    _id: req.params.placeid
  }, function(err, place) {
    if (err)
      res.send(err);
    res.json({
      message: 'Place successfully deleted'
    });
  });
};
