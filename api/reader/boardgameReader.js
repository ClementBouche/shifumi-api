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
    subdomain: parseSubdomain(data.boardgamesubdomain),
    thematics: parseThematics(data.boardgamecategory),
    mechanics: parseMechanics(data.boardgamemechanic),
    artists: parseArtists(data.boardgameartist),
    designers: parseDesigners(data.boardgamedesigner),
    suggested_players: parseSuggestedPlayers(data.poll),
  };
  boardgame = parseStatistics(boardgame, data.statistics[0]);
  for (var i = 0; i < data.name.length; i++) {
    if (data.name[i]["$"]["primary"]) {
      boardgame.name = data.name[i]["_"];
    }
  }
  return boardgame;
}

var parseSubdomain = function(jsondata) {
  if( typeof jsondata === 'undefined'
  || typeof jsondata[0] === 'undefined'
  || typeof jsondata[0]["_"] === 'undefined'
  ) {
    return "" ;
  }
  return jsondata[0]["_"];
}

var parseSuggestedPlayers = function(jsondata) {
  if( typeof jsondata === 'undefined'
  || typeof jsondata[0] === 'undefined'
  ) {
    return {} ;
  }
  var poll = [];
  try {
    for (var i = 0; i < jsondata[0].results.length; i++) {
      poll.push({
        player_count: jsondata[0].results[i]["$"].numplayers,
        best: jsondata[0].results[i]["result"][0]["$"].numvotes,
        recommanded: jsondata[0].results[i]["result"][1]["$"].numvotes,
        not_recommanded: jsondata[0].results[i]["result"][2]["$"].numvotes
      });
    }
  } catch(error) {
    console.error(error);
    console.log(jsondata);
    return {};
  }
  return {
    votes: jsondata[0]["$"].totalVotes,
    poll: poll
  };
}

var parseDesigners = function(jsondata) {
  if( typeof jsondata === 'undefined'
  || ! jsondata.hasOwnProperty('length')
  ) {
    return [] ;
  }
  var designers = [];
  for (var i = 0; i < jsondata.length; i++) {
    designers.push({
      xmlapi_id: jsondata[i]["$"].objectid,
      name: jsondata[i]["_"]
    });
  }
  return designers;
}
var parseArtists = function(jsondata) {
  if( typeof jsondata === 'undefined'
  || ! jsondata.hasOwnProperty('length')
  ) {
    return [] ;
  }
  var artists = [];
  for (var i = 0; i < jsondata.length; i++) {
    artists.push({
      xmlapi_id: jsondata[i]["$"].objectid,
      name: jsondata[i]["_"]
    });
  }
  return artists;
}

var parseThematics = function(jsondata) {
  if( typeof jsondata === 'undefined'
  || ! jsondata.hasOwnProperty('length')
  ) {
    return [] ;
  }
  var thematics = [];
  for (var i = 0; i < jsondata.length; i++) {
    thematics.push(jsondata[i]["_"]);
  }
  return thematics;
}
var parseMechanics = function(jsondata) {
  if( typeof jsondata === 'undefined'
  || ! jsondata.hasOwnProperty('length')
  ) {
    return [] ;
  }
  var mechanics = [];
  for (var i = 0; i < jsondata.length; i++) {
    mechanics.push(jsondata[i]["_"]);
  }
  return mechanics;
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




var parseStatistics = function(boardgame, jsondata) {
  if( typeof jsondata === 'undefined'
    || ! jsondata.hasOwnProperty('ratings')
    || ! jsondata['ratings'].hasOwnProperty('length')
  ) {
    return boardgame ;
  }
  var data = jsondata['ratings'][0];
  boardgame.votes_note = data.usersrated[0],
  boardgame.average_note = data.average[0],
  boardgame.bayes_note = data.bayesaverage[0],
  boardgame.votes_complexity = data.numweights[0],
  boardgame.complexity = data.averageweight[0],
  boardgame.rank = parseRank(data.ranks),
  boardgame.other_ranks = parseOtherRanks(data.ranks)
  return boardgame;
}

var parseRank = function(jsondata) {
  if( typeof jsondata === 'undefined'
    || ! jsondata.hasOwnProperty('length')
    || ! jsondata[0].hasOwnProperty('rank')
    || ! jsondata[0]['rank'].hasOwnProperty('length')
  ) {
    return null ;
  }
  var data = jsondata[0]['rank'];
  for (var i = 0; i < data.length; i++) {
    if(data[i]['$'].id === '1') {
      return data[i]['$'].value;
    }
  }
  return null;
}

var parseOtherRanks = function(jsondata) {
  var ranks = [];
  if( typeof jsondata === 'undefined'
    || ! jsondata.hasOwnProperty('length')
    || ! jsondata[0].hasOwnProperty('rank')
    || ! jsondata[0]['rank'].hasOwnProperty('length')
  ) {
    return ranks ;
  }
  var data = jsondata[0]['rank'];
  for (var i = 0; i < data.length; i++) {
    if(data[i]['$'].id === '1') {
      continue;
    }
    var rank = {
      type: data[i]['$'].type,
      id: data[i]['$'].id,
      name: data[i]['$'].name,
      description: data[i]['$'].friendlyname,
      rank: data[i]['$'].value,
      bayes_note: data[i]['$'].bayesaverage
    }
    ranks.push(rank);
  }
  return ranks;
}