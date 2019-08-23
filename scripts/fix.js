'use strict';

const mongoose = require('mongoose');
const config = require('../config'); // get our config file

require('../api/models/boardgameModel');
require('../api/models/playModel');

mongoose.Promise = global.Promise;
mongoose.connect(
  config.database,
  { 
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

const Play = mongoose.model('Plays');
const Boardgame = mongoose.model('Boardgames');

const updatePlay = function(play) {
  // look for boardgame id
  Boardgame.findOne({
    name: play.boardgame_name
  }, function(err, boardgame) {
    if (err) return console.error(`${play.boardgame_name} not found`);

    const id = boardgame && boardgame._id ? boardgame._id : '';
    play.boardgame_id = id;

    const thumbnail = boardgame && boardgame.thumbnail ? boardgame.thumbnail : '';
    play.thumbnail = thumbnail;

    play.save(function(err, saved) {
      if (err) return console.error(err);

      console.log(`${saved.thumbnail} updated`);
    });
  });

}

// Run script
/**
 * Search all plays
 * - update each play
 */
const condition = {};
const options = {
  sort: { date: -1 }
};
// options.limit = 100
// options.skip = 10
Play.find(condition, null, options, function(err, plays) {
    if (err) console.error(err);

    plays.forEach((play) => {
      updatePlay(play);
    });

  }
);

