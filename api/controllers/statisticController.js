'use strict';

var mongoose = require('mongoose');

var statisticService = require('../statistic/global');

var Boardgame = mongoose.model('Boardgames');
var Play = mongoose.model('Plays');
var Player = mongoose.model('Players');
var Place = mongoose.model('Places');

// update global statistic data  for places
exports.place = function(req, res) {
  var getPlays = Play.find({}).exec();
  var getPlaces = Place.find({}).exec();
  var getBoardgames = Boardgame.find({}).exec();
  Promise.all([getPlays, getPlaces, getBoardgames])
    .then(([plays, places, boardgames]) => {
      for (var i = 0; i < places.length; i++) {
        var stats = statisticService.statsByPlace(plays, boardgames, places[i].name);
        Object.assign(places[i], stats);
        places[i].save();
      }
      res.json(places);
    })
    .catch((error) => {
      res.send(error);
    });
};

// update global statistic data for players
exports.player = function(req, res) {
  var getPlays = Play.find({}).exec();
  var getPlayer = Player.findById(req.params.playerid).exec();
  var getBoardgames = Boardgame.find({}).exec();
  Promise.all([getPlays, getPlayer, getBoardgames])
    .then(([plays, player, boardgames]) => {
      if (player) {
        var stats = statisticService.statsByPlayer(plays, boardgames, player.name);
        Object.assign(player, stats);
        player.save();
      }
      res.json(player);
    })
    .catch((error) => {
      res.send(error);
    });
}

// update global statistic data for players
exports.boardgame = function(req, res) {
  var getPlays = Play.find({}).exec();
  var getBoardgames = Boardgame.find({}).exec();
  Promise.all([getPlays, getBoardgames])
    .then(([plays, boardgames]) => {
      for (var i = 0; i < boardgames.length; i++) {
        var stats = statisticService.statsByBoardgame(plays, boardgames[i]);
        Object.assign(boardgames[i], stats);
        boardgames[i].save();
      }
      res.json(boardgames);
    })
    .catch((error) => {
      res.send(error);
    });
}
