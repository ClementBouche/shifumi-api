'use strict';

var mongoose = require('mongoose');

var User = mongoose.model('Users');

exports.checkMyself = function(req, res, next) {
  const userToken = req.decoded;

  console.log(userToken);
  console.log(req.params.userid);
  
  if (userToken.id !== req.params.userid) {
      // if there is no token
      // return an error
      return res.status(403).send({
        success: false, 
        message: 'Unreadeable token.' 
    });
  }

  next();
}

exports.list = function(req, res) {
  const projection = {
    username: 1,
    email: 1,
    admin: 1
  };
  User.find({}, projection, function(err, users) {
    if (err) return res.send(err);
    res.json(users);
  });
}

exports.read = function(req, res) {
  User.findById(req.params.userid, function(err, user) {
    if (err) return res.send(err);
    res.json(user);
  });
};

exports.update = function(req, res) {
  User.findOneAndUpdate(req.params.userid, req.body, {
    new: true
  }, function(err, user) {
    if (err) return res.send(err);
    res.json(user);
  });
};

exports.claim = function(req, res) {
  const playerIdsClaimed = req.body.player_ids_claimed || [];
  User.findById(req.params.userid, function(err, user) {
    if (err) return res.send(err);
    user.player_ids_claimed = playerIdsClaimed;
    user.save();
    res.json(user);
  });
}
