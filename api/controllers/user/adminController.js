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

exports.update = function(req, res) {
  User.findOneAndUpdate(req.params.userid, req.body, {
    new: true
  }, function(err, user) {
    if (err) return res.send(err);
    res.json(user);
  });
};

exports.delete = function(req, res) {
  User.deleteOne({
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

    const promises = user.player_ids_claimed
        .map((playerid) => updatePlayer(user, playerid, res));
  
    Promise.all(promises)
      .then(() => {
        user.player_ids_claimed = [];
        user.save().then(() => {
          res.json(user);
        });
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500).send('Error');
      })
  });

}

const updatePlayer = function(user, playerid, res) {
  let player;
  return Player.findById(playerid)
    .exec()
    .then((result) => {
      player = result;
    })
    .then(() => {
      const filters = {};
      filters['scores.player_name'] = player.name;
      return Play.find(filters).exec();
    })
    .then((plays) => {
      return plays.map((play) => updatePlay(user, player, play));
    })
    .then(() => {
      console.log('player name claimed');
      player.name = user.username;
      player.user_id = user.id;
      if (!player.name) {
        throw Error('le nom est vide');
      }
      return player.save();
    });
}

const updatePlay = function(user, player, play) {
  console.log('play claimed : ', play.boardgame_name, ' for ', user.username);
  play.scores
    .filter((sc) => sc.player_name === player.name)
    .forEach((score) => {
      score.player_name = user.username;
    });
  return play.save();
}
