'use strict';

var mongoose = require('mongoose');
var request = require('request');
var xml2js = require('xml2js');

var boardgameReader = require('../reader/boardgameReader');

var Boardgame = mongoose.model('Boardgames');
var Play = mongoose.model('Plays');
var Player = mongoose.model('Players');
var Place = mongoose.model('Places');


exports.boardgames = function(req, res) {
  var searchUrl = 'https://www.boardgamegeek.com/xmlapi/search';
  var xmlResponse = '';
  if(!req.query.name) {
    res.json({
      message: 'Erreur : Ajouter un nom en parametre'
    }) ;
  } else {
    request
      .get(`${searchUrl}?search=${req.query.name}`)
      .on('data', function(chunk) {
        xmlResponse += chunk;
      })
      .on('end', function(response) {
        xml2js.parseString(xmlResponse, function(err, result) {
          if (req.query.original) {
            res.json(result);
          } else {
            res.json(boardgameReader.parseBoardgames(result));
          }
        });
      });
  }
};


exports.boardgame_by_id = function(req, res) {
  Boardgame.findOne({
    xmlapi_id: req.params.id
  }, function(err, result) {
    if (err) {
      res.json({
        message: 'Error'
      })
    } else if (result && !req.query.original) {
      res.json(result);
    } else {
      getXMLBoardgameById(req, res);
    }
  });
};

function getXMLBoardgameById(req, res) {
  var boardgameUrl = 'https://www.boardgamegeek.com/xmlapi/boardgame';
  var xmlResponse = '';
  request
    .get(`${boardgameUrl}/${req.params.id}?stats=1`)
    .on('data', function(chunk) {
      xmlResponse += chunk;
    })
    .on('end', function(response) {
      xml2js.parseString(xmlResponse, function(err, result) {
        if (req.query.original) {
          res.json(result);
        } else {
          var new_boargame = new Boardgame(boardgameReader.parseBoardgame(result));
          new_boargame.save(function(err, boardgame) {
            if (err) {
              res.json({
                message: err
              });
            } else {
              res.json(boardgame);
            }
          });
        }
      });
    });
};


exports.plays = function(req, res) {
  var playsUrl = 'https://www.boardgamegeek.com/xmlapi2/plays';
  var xmlResponse = '';
  request
    .get(`${playsUrl}?username=cbouche&page=${req.query.page}`)
    .on('data', function(chunk) {
      xmlResponse += chunk;
    })
    .on('end', function(response) {
      xml2js.parseString(xmlResponse, function(err, result) {
        if (req.query.original) {
          res.json(result);
        } else {
          var plays = boardgameReader.parsePlays(result);
          saveData(plays).then((plays) => {
            res.json(plays);
          }).catch(() => {
            res.json({
              message: 'Error'
            });
          });
        }
      });
    });
};
function saveData(plays) {
  return new Promise(function(resolve, reject) {
    for (var i = 0; i < plays.length; i++) {
      // find or save new play
      findOrSavePlay(plays[i]);
      // find or save new place
      findOrSavePlace(plays[i].place_name);
      // find or save new player
      for (var j = 0; j < plays[i].scores.length; j++) {
        findOrSavePlayer(plays[i].scores[j].player_name);
      }
    }
    return resolve(plays);
  });
};
function findOrSavePlay(play) {
  Play.findOneAndUpdate({
    xmlapi_id: play.xmlapi_id
  },
  play,{
    upsert: true
  }, function(err, result) {
    if (err) {
      return err;
    }
  });
};
function findOrSavePlace(placeName) {
  Place.findOneAndUpdate({
    name: placeName
  },{
    name: placeName
  },{
    upsert: true
  }, function(err, result) {
    if (err) {
      return err;
    }
  });
};
function findOrSavePlayer(playerName) {
  Player.findOneAndUpdate({
    name: playerName
  },{
    name: playerName
  },{
    upsert: true
  }, function(err, result) {
    if (err) {
      return err;
    }
  });
};


exports.play_by_id = function(req, res) {
  res.json({
    message: 'play by id success'
  });
};
