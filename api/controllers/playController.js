'use strict';

var mongoose = require('mongoose');
var request = require('request');
var xml2js = require('xml2js');

var Play = mongoose.model('Plays');

Play.getPaginatedPlays = function(skip, limit, callback) {
  Play.find(null, null, {
      sort: { date: 1 },
      skip: skip,
      limit: limit
    },
    function(err, results) {
      callback(err, results);
    }
  );
}

exports.list = function(req, res) {
  console.log("play controller list");
  var size = 10 ;
  if (req.query.size) {
    size = req.query.size;
  }
  var page = 0 ;
  if (req.query.page) {
    page = req.query.page - 1;
  }
  var skip = page * size ;

  Play.getPaginatedPlays(skip, size, function(err, plays) {
    if(err) {
      res.send(err);
    }
    res.json(plays);
  })
};

exports.create = function(req, res) {
  console.log("play controller create");
  var new_boargame = new Play(req.body);
  new_boargame.save(function(err, play) {
    if (err)
      res.send(err);
    res.json(play);
  });
};


exports.read = function(req, res) {
  console.log("play controller read");
  Play.findById(req.params.playid, function(err, play) {
    if (err)
      res.send(err);
    res.json(play);
  });
};


exports.update = function(req, res) {
  console.log("play controller update");
  Play.findOneAndUpdate(req.params.playid, req.body, {
    new: true
  }, function(err, play) {
    if (err)
      res.send(err);
    res.json(play);
  });
};


exports.delete = function(req, res) {
  console.log("play controller delete");

  Play.remove({
    _id: req.params.playid
  }, function(err, play) {
    if (err)
      res.send(err);
    res.json({
      message: 'Play successfully deleted'
    });
  });
};


exports.search = function(req, res) {

  // TODO example url
  // TODO https://www.boardgamegeek.com/xmlapi2/plays?username=cbouche

  var searchUrl = 'https://www.boardgamegeek.com/xmlapi2/plays';
  console.log('search :' + `${searchUrl}?username=cbouche&page=${req.query.page}`);

  request
    .get(`${searchUrl}?username=cbouche&page=${req.query.page}`)
    .on('response', function(response) {
      console.log(response.statusCode) // 200
      var xml = '' ;
      response.on('data', (chunk) => {
        xml += chunk;
      });
      response.on('end', () => {
        xml2js.parseString(xml, function (err, result) {
            console.log("parsing success");

            var data = result.plays.play ;
            var total = result.plays.total ;
            var page = result.plays.page ;

            var plays = [] ;
            for (var i = 0; i < data.length; i++) {
              var play = {
                play_id: data[i]["$"].id,
                date: data[i]["$"].date,
                location: data[i]["$"].location,
                boardgame_id: data[i]["item"][0]["$"].objectid,
                boardgame_name: data[i]["item"][0]["$"].name,
                players: []
              };
              var players = [];
              for (var j = 0; j < data[i]["players"][0]["player"].length; j++) {
                var player = {
                  name: data[i]["players"][0]["player"][j]["$"].name,
                  score: data[i]["players"][0]["player"][j]["$"].score,
                  win: data[i]["players"][0]["player"][j]["$"].win
                }
                players.push(player);
              }
              play.players = players ;

              var new_play = new Play(play);
              new_play.save(function(err, play) {
                if (err)
                  console.log("play error");
                console.log("play save");
              });

              plays.push(play);
            }
            res.json(plays);
          })
        })
    });

}

exports.search_by_id = function(req, res) {

  var playUrl = 'https://www.playgeek.com/xmlapi/play';
  console.log('proxy boargame :' + `${playUrl}/${req.params.id}`);

  request
    .get(`${playUrl}/${req.params.id}`)
    .on('response', function(response) {
      console.log(response.statusCode) // 200
      var xml = '' ;
      response.on('data', (chunk) => {
        xml += chunk;
      });
      response.on('end', () => {
        xml2js.parseString(xml, function (err, result) {

            console.log("parsing success");

            var data = result.plays.play[0];

            var play = {
              objectid: data["$"].objectid,
              year_published: data.yearpublished[0],
              min_players: data.minplayers[0],
              max_players: data.maxplayers[0],
              playing_time: data.playingtime[0],
              min_play_time: data.minplaytime[0],
              max_play_time: data.maxplaytime[0],
              age: data.age[0],
              name: data.name[0]["_"],
              description: data.description[0],
              thumbnail: data.thumbnail[0],
              image: data.image[0],
            } ;
            for (var i = 0; i < data.name.length; i++) {
              if(data.name[i]["$"]["primary"]) {
                play.name = data.name[i]["_"];
              }
            }

            var new_boargame = new Play(play);

            console.log(new_boargame);

            new_boargame.save(function(err, play) {
              if (err)
                res.send(err);
              res.json(play);
            });

        });
      });
    });

}
