'use strict';

var mongoose = require('mongoose');

var User = mongoose.model('Users');
var Player = mongoose.model('Players');
var Play = mongoose.model('Plays');

exports.create = function(req, res) {
  var new_user = new User(req.body);
  new_user.save(function(err, user) {
    if (err) return res.send(err);
    res.json(user);
  });
}

exports.delete = function(req, res) {
  User.remove({
    _id: req.params.userid
  }, function(err, user) {
    if (err) return res.send(err);
    res.json({
      message: 'User successfully deleted'
    });
  });
};

exports.claim = function(req, res) {
  User.findById(req.params.userid, function(err, user) {
    if (err) return res.send(err);

    console.log('claiming....');

    user.player_ids_claimed
      .map((playerid) => updatePlayer(user, playerid))
      .then((plays) => {
        user.player_ids_claimed = [];
        console.log('end claiming, play updated : ', plays.length);
        user.save().then(() => {
          res.json(user);
        });
      });
  });

}

const updatePlayer = function(user, playerid) {
  return Player.findById(playerid)
    .exec()
    .then((player) => {
      console.log('player name claimed');
      player.name = user.name;
      return player.save();
    })
    .then(() => {
      const filters = {};
      filters['scores.player_name'] = player;
      return Play.find(filters).exec();
    })
    .then((plays) => {
      return plays.map((play) => updatePlay(user, play));
    });
}

const updatePlay = function(user, play) {
  console.log('play claimed : ', play.boardgame_name);
  play.scores
    .filter((sc) => sc.player_name === user.name)
    .forEach((score) => {
      score.player_name = user.name;
    });
  return play.save();
}
