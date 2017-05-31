'use strict';
//https://www.boardgamegeek.com/xmlapi2/plays?username=cbouche
var mongoose = require('mongoose');
var request = require('request');
var xml2js = require('xml2js');

var Boardgame = mongoose.model('Boardgames');

exports.list = function(req, res) {
  console.log("boardgame controller list");
  Boardgame.find({}, function(err, boardgame) {
    if (err)
      res.send(err);
    res.json(boardgame);
  });
};

exports.create = function(req, res) {
  console.log("boardgame controller create");
  var new_boargame = new Boardgame(req.body);
  new_boargame.save(function(err, boardgame) {
    if (err)
      res.send(err);
    res.json(boardgame);
  });
};


exports.read = function(req, res) {
  console.log("boardgame controller read");
  // Boardgame.findOne({
  //   objectid: req.params.boardgameid
  // }, function(err, boardgame) {
  //   if (err)
  //     res.send(err);
  //   res.json(boardgame);
  // });
  Boardgame.findById(req.params.boardgameid, function(err, boardgame) {
    if (err)
      res.send(err);
    res.json(boardgame);
  });
};


exports.update = function(req, res) {
  console.log("boardgame controller update");
  Boardgame.findOneAndUpdate(req.params.boardgameid, req.body, {
    new: true
  }, function(err, boardgame) {
    if (err)
      res.send(err);
    res.json(boardgame);
  });
};


exports.delete = function(req, res) {
  console.log("boardgame controller delete");

  Boardgame.remove({
    _id: req.params.boardgameid
  }, function(err, boardgame) {
    if (err)
      res.send(err);
    res.json({
      message: 'Boardgame successfully deleted'
    });
  });
};


exports.search = function(req, res) {

  var searchUrl = 'https://www.boardgamegeek.com/xmlapi/search';
  console.log('search :' + `${searchUrl}?search=${req.query.search}`);

  request
    .get(`${searchUrl}?search=${req.query.search}`)
    .on('response', function(response) {
      console.log(response.statusCode) // 200
      var xml = '';
      response.on('data', (chunk) => {
        xml += chunk;
      });
      response.on('end', () => {
        xml2js.parseString(xml, function(err, result) {
          console.log("parsing success");

          var data = result.boardgames.boardgame;
          var boardgames = [];
          for (var i = 0; i < data.length; i++) {
            var boardgame = {
              objectid: data[i]["$"].objectid,
              name: data[i].name[0]['_'],
              //  year_published: data[i].yearpublished[0]
            };
            if (data[i].hasOwnProperty('yearpublished') && data[i].yearpublished.length !== 0) {
              boardgame.year_published = data[i].yearpublished[0];
            }
            boardgames.push(boardgame);
          }

          res.json(boardgames);
        })
      })
    });
}



exports.search_by_id = function(req, res) {
  Boardgame.findOne({
    objectid: req.params.id
  }, function(err, result) {

    if (err) {
      // TODO erreur
      res.json({
        'message': 'erreur fatale'
      });

    } else if (!result) {
      // TODO existe pas
      var boardgameUrl = 'https://www.boardgamegeek.com/xmlapi/boardgame';
      console.log('proxy boardgame :' + `${boardgameUrl}/${req.params.id}`);
      request
        .get(`${boardgameUrl}/${req.params.id}`)
        .on('response', function(response) {
          console.log(response.statusCode) // 200
          var xml = '';
          response.on('data', (chunk) => {
            xml += chunk;
          });
          response.on('end', () => {
            xml2js.parseString(xml, function(err, jsondata) {
              console.log("parsing success");
              var new_boargame = new Boardgame(parseBoardgame(jsondata));
              new_boargame.save(function(err, boardgame) {
                console.log("create new");
                if (err)
                  res.json({
                    'message': 'erreur fatale'
                  });
                res.json(boardgame);
              });
            });
          });
        });

    } else {
      // TODO existe
      console.log("already exist");
      res.json(result);
    }
  });
}

function parseBoardgame(jsondata) {
  var _bg = jsondata.boardgames.boardgame[0];
  var boardgame = {
    objectid: _bg["$"].objectid,
    year_published: _bg.yearpublished[0],
    min_players: _bg.minplayers[0],
    max_players: _bg.maxplayers[0],
    playing_time: _bg.playingtime[0],
    min_play_time: _bg.minplaytime[0],
    max_play_time: _bg.maxplaytime[0],
    age: _bg.age[0],
    name: _bg.name[0]["_"],
    description: _bg.description[0],
    thumbnail: _bg.thumbnail[0],
    image: _bg.image[0],
  };
  for (var i = 0; i < _bg.name.length; i++) {
    if (_bg.name[i]["$"]["primary"]) {
      boardgame.name = _bg.name[i]["_"];
    }
  }
  return boardgame;
}
