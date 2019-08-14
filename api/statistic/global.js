'use strict';

exports.statsByPlace = function(plays, boardgames, placeName) {
  var time = 0,
    playsCount = 0,
    incompletes = 0,
    players = [],
    boardgamesPlayed = [];
  for (var i = 0; i < plays.length; i++) {
    var play = plays[i];
    if (play.place_name !== placeName) {
      continue ;
    }
    // plays
    playsCount++;
    if (play.incomplete) {
      incompletes++;
    }
    // time
    if (play.playing_time !== 0) {
      time += play.playing_time;
    } else {
      var bg = boardgames.find(
        (bg) => bg.xmlapi_id === play.boardgame_xmlapi_id
      );
      if(bg !== undefined) {
        time += bg.playing_time ;
      }
    }
    // boardgames
    var boardgame = play.boardgame_xmlapi_id;
    if (boardgamesPlayed.indexOf(boardgame) === -1)
      boardgamesPlayed.push(boardgame);
    // players
    var names = play.scores.map((score) => score.player_name);
    for (var j = 0; j < names.length; j++) {
      if (players.indexOf(names[j]) === -1)
        players.push(names[j]);
    }
  };
  return {
    play_time: time,
    players_count: players.length,
    plays_count : playsCount,
    plays_incomplete_count : incompletes,
    boardgames_count: boardgamesPlayed.length
  };
};


exports.statsByPlayer = function(plays, boardgames, playerName) {
  var time = 0,
    playsCount = 0,
    incompletes = 0,
    wins = 0,
    players = [],
    boardgamesPlayed = [],
    places = [];
  for (var i = 0; i < plays.length; i++) {
    var play = plays[i];
    var myScore = play.scores.find((score) => score.player_name === playerName);
    if (myScore === undefined) {
      continue ;
    }
    // plays
    playsCount++;
    if (play.incomplete) {
      incompletes++;
    }
    if (myScore.win) {
      wins++;
    }
    // time
    if (play.playing_time !== 0) {
      time += play.playing_time;
    } else {
      var bg = boardgames.find(
        (bg) => bg.id === play.boardgame_id
      );
      if(bg !== undefined) {
        time += bg.playing_time ;
      }
    }
    // boardgames
    var boardgame = play.boardgame_id;
    if (boardgamesPlayed.indexOf(boardgame) === -1)
      boardgamesPlayed.push(boardgame);
    // boardgames
    var place = play.place_name;
    if (places.indexOf(place) === -1)
      places.push(place);
    // players
    var names = play.scores.map((score) => score.player_name);
    for (var j = 0; j < names.length; j++) {
      if (names[j] !== playerName && players.indexOf(names[j]) === -1)
        players.push(names[j]);
    }
  }
  return {
    boardgames_count: boardgamesPlayed.length,
    plays_count: playsCount,
    plays_incomplete_count: incompletes,
    plays_win_count: wins,
    places_count: places.length,
    players_count: players.length,
    play_time: time,
    win_ratio: playsCount !== 0 ? Math.trunc(wins/playsCount*100) : 0
  };
};


exports.statsByBoardgame = function(plays, boardgame) {
  var time = 0,
    playsCount = 0,
    incompletes = 0,
    wins = 0,
    players = [],
    places = [];
  for (var i = 0; i < plays.length; i++) {
    var play = plays[i];
    // plays
    playsCount++;
    if (play.incomplete) {
      incompletes++;
    }
    // time
    if (play.playing_time !== 0) {
      time += play.playing_time;
    } else {
      time += boardgame.playing_time;
    }
    // places
    var place = play.place_name;
    if (places.indexOf(place) === -1)
      places.push(place);
    // players
    var names = play.scores.map((score) => score.player_name);
    for (var j = 0; j < names.length; j++) {
      if (players.indexOf(names[j]) === -1)
        players.push(names[j]);
    }
  }
  return {
    plays_count: playsCount,
    plays_incomplete_count: incompletes,
    places_count: places.length,
    players_count: players.length,
    play_time: time
  };
};
