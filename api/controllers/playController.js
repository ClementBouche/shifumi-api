'use strict';

var mongoose = require('mongoose');

var Play = mongoose.model('Plays');

exports.list = function(req, res) {
  var size = 10 ;
  if (req.query.size) {
    size = req.query.size;
  }
  var page = 0 ;
  if (req.query.page) {
    page = req.query.page - 1;
  }
  var skip = page * size ;

  Play.getPaginatedPlays(skip, size, function(err, plays) {
    if(err) {
      res.send(err);
    }
    res.json(plays);
  })
};

exports.create = function(req, res) {
  var new_boargame = new Play(req.body);
  new_boargame.save(function(err, play) {
    if (err)
      res.send(err);
    res.json(play);
  });
};


exports.read = function(req, res) {
  Play.findById(req.params.playid, function(err, play) {
    if (err)
      res.send(err);
    res.json(play);
  });
};


exports.update = function(req, res) {
  Play.findOneAndUpdate(req.params.playid, req.body, {
    new: true
  }, function(err, play) {
    if (err)
      res.send(err);
    res.json(play);
  });
};


exports.delete = function(req, res) {
  Play.remove({
    _id: req.params.playid
  }, function(err, play) {
    if (err)
      res.send(err);
    res.json({
      message: 'Play successfully deleted'
    });
  });
};


Play.getPaginatedPlays = function(skip, limit, callback) {
  Play.find(null, null, {
      sort: { date: 1 },
      skip: skip,
      limit: limit
    },
    function(err, results) {
      callback(err, results);
    }
  );
}
