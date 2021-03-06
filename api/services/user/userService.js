'use strict';

const config = require('../../../config'); // get our config file
const mongoose = require('mongoose');

const PlayerService = require('../player/playerService');

const User = mongoose.model('Users');
const Player = mongoose.model('Players');

exports.renameUser = function(user, newName) {
    if (!newName) {
      return Promise.reject('le nom est vide');
    }

    const filters = {};
    filters['user_id'] = user.id;

    user.username = newName;

    return Player.find(filters).exec()
      .then((players) => {
        return Promise.all(players.map((player) => PlayerService.renamePlayer(player, newName)));
      })
      .then(() => {
        return user.save();
      })
      .then(() => {
        return user;
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });

}
