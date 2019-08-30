'use strict';

const config = require('../../../config'); // get our config file
const mongoose = require('mongoose');

const Play = mongoose.model('Plays');
const Player = mongoose.model('Players');

exports.renamePlayer = function(player, newName) {
    if (!newName) {
      return Promise.reject('le nom est vide');
    }
    console.log('renamePlayer');

    const filters = {};
    filters['scores.player_name'] = player.name;

    return Play.find(filters).exec()
      .then((plays) => {
        return plays.map((play) => renamePlayerInPlay(play, player.name, newName));
      })
      .then((newPlays) => {
        return Promise.all(newPlays.map((play) => play.save()));
      })
      .then(() => {
        player.name = newName;
        return player.save();
      })
      .then(() => {
        return player;
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
}

const renamePlayerInPlay = function(play, name, newName) {
  play.scores
    .filter((sc) => sc.player_name === name)
    .forEach((score) => {
      score.player_name = newName;
    });
  return play;
}
