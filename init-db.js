'use strict';

var requestPromise = require('request-promise');

var totalPlays = 712,
  playUrl      = 'http://rks1306w176.ign.fr/search/play',
  boardgameUrl = 'http://rks1306w176.ign.fr/search/boardgame';

var loadCollection = function(playsCount) {
  loadPlays(playsCount)
    .then((plays) => {
      return loadGames(plays);
    })
    .then((result) => {
      console.log('Quel success !');
    })
    .catch((error) => {
      console.error(error);
    });
}

var loadGames = function(plays) {
  var boardgames = new Set(
    plays.map((play) => play.boardgame_xmlapi_id)
  );
  var promises = [];
  var pause = 1;
  for (var boardgameid of boardgames) {
    setTimeout((id) => {
      promises.push(pBoardgame(id));
    }, 15000*pause, boardgameid);
    pause++;
  }
  return Promise.all(promises);
}
var pBoardgame = function(id) {
  var url = `${boardgameUrl}/${id}`;
  console.log(url);
  var promise = requestPromise({
      method: 'GET',
      uri: url,
      json: true
  });
  return promise;
}

var loadPlays = function(playsCount) {
  var nbPage = Math.floor(playsCount/100)+1;
  var promises = [];
  for (var i = 1; i <= nbPage; i++) {
    promises.push(pPlays(i));
  }
  return Promise.all(promises)
    .then((result) => {
      var plays = [];
      for (var i = 0; i < result.length; i++) {
        plays = result[i].concat(plays);
      }
      return Promise.resolve(plays) ;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
var pPlays = function(page) {
  var url = `${playUrl}?page=${page}`;
  console.log(url);
  var promise = requestPromise({
      method: 'GET',
      uri: url,
      json: true
  });
  return promise;
}

loadCollection(totalPlays);
console.log('End command');
