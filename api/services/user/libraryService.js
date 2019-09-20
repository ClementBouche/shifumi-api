'use strict';

const config = require('../../../config'); // get our config file
const mongoose = require('mongoose');

const PlayerService = require('../player/playerService');

const User = mongoose.model('Users');
const Player = mongoose.model('Players');

exports.filter = function(library, mode) {
  if (mode === null) {
    return library;
  };

  library = mode === 'owned' ? library.filter((item) => item.state === mode) : library;
  return library;
}
