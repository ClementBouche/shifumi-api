'use strict';

exports.parseBoardgames = function(jsondata) {
  var data = jsondata.boardgames.boardgame;
  var boardgames = [];
  for (var i = 0; i < data.length; i++) {
    var boardgame = {
      xmlapi_id: data[i]["$"].objectid,
      name: data[i].name[0]['_']
    };
    if (data[i].hasOwnProperty('yearpublished') && data[i].yearpublished.length !== 0) {
      boardgame.year_published = data[i].yearpublished[0];
    }
    boardgames.push(boardgame);
  }
  return boardgames;
}

exports.parseBoardgame = function(jsondata) {
  var data = jsondata.boardgames.boardgame[0];
  var boardgame = {
    xmlapi_id: data["$"].objectid,
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
  };
  for (var i = 0; i < data.name.length; i++) {
    if (data.name[i]["$"]["primary"]) {
      boardgame.name = data.name[i]["_"];
    }
  }
  return boardgame;
}

exports.parsePlays = function(jsondata) {
  var data = jsondata.plays.play;
  var plays = [];
  for (var i = 0; i < data.length; i++) {
    plays.push(parsePlay(data[i]));
  }
  return plays;
}

var parsePlay = function(jsondata) {
  var play = {
    xmlapi_id: jsondata["$"].id,
    date: jsondata["$"].date,
    place_name: jsondata["$"].location,
    boardgame_xmlapi_id: jsondata["item"][0]["$"].objectid,
    boardgame_name: jsondata["item"][0]["$"].name,
    playing_time: jsondata["$"].length,
    incomplete: jsondata["$"].incomplete === "1" ? true : false,
    scores: parseScores(jsondata["players"][0]["player"])
  };
  return play ;
}

var parseScores = function(jsondata) {
  var scores = [];
  for (var i = 0; i < jsondata.length; i++) {
    var score = {
      player_name: jsondata[i]["$"].name,
      score: jsondata[i]["$"].score,
      win: jsondata[i]["$"].win === "1" ? true : false,
      new: jsondata[i]["$"].new === "1" ? true : false
    }
    scores.push(score);
  }
  return scores;
}
