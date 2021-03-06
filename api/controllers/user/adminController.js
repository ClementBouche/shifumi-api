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
    })
    .exec()
    .then(() => {
      return Player.find({ user_id : req.params.userid }).exec();
    })
    .then((players) => {
      return players.map(player => {
        player.user_id = null;
        return player.save()
      });
    })
    .then(() => {
      return res.json({
        message: 'User successfully deleted'
      });
    })
    .catch(() => {
      res.send(err);
    });
};

exports.claim = function(req, res) {
  User.findById(req.params.userid, function(err, user) {
    if (err) return res.send(err);

    if (!user.player_id && user.player_ids_claimed && user.player_ids_claimed[0]) {
      user.player_id = user.player_ids_claimed[0];
    }

    const promises = user.player_ids_claimed
        .map((playerid) => updatePlayer(user, playerid));

    Promise.all(promises)
      .then(() => {
        user.player_ids_claimed = [];
        user.save().then(() => {
          res.json(user);
        });
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500).send('Error');
      })
  });

}

const updatePlayer = function(user, playerid) {
  let player;
  return Player.findById(playerid)
    .exec()
    .then((result) => {
      player = result;
    })
    .then(() => {
      if (!player || !player.name) {
        return;
      }
      const filters = {};
      filters['scores.player_name'] = player.name;
      return Play.find(filters).exec();
    })
    .then((plays) => {
      if (!plays) {
        return;
      }
      return Promise.all(plays.map((play) => updatePlay(user, player, play)));
    })
    .then(() => {
      if (!player) {
        return;
      }
      player.name = user.username;
      player.user_id = user.id;
      if (!player.name) {
        throw Error('le nom est vide');
      }
      if (player.id === user.player_id) {
        return player.save();
      }
      player.delete();
    });
}

const updatePlay = function(user, player, play) {
  play.scores
    .filter((sc) => sc.player_name === player.name)
    .forEach((score) => {
      score.player_name = user.username;
      score.player_id = user.player_id;
    });
  return play.save();
}
