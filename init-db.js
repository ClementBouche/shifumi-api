'use strict';

var requestPromise = require('request-promise');

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

const host = 'localhost:3000';

var totalPlays = 820,
  playUrl      = `http://${host}/mining/play`,
  boardgameUrl = `http://${host}/mining/boardgame`;

var boardgameIDS = [174476, 432, 68448, 173346, 202976, 31260, 154458, 6249, 155068, 105551, 144797, 205637, 167400, 2397, 3955, 143741, 123123, 146439, 37111, 171233, 170216, 85005, 161226, 172081, 155362, 171131, 822, 50381, 84876, 155426, 13, 102794, 175117, 209685, 171, 47, 161943, 478, 201808, 40765, 178900, 198773, 24742, 134150, 188188, 147151, 124361, 39463, 172971, 54998, 197831, 150376, 193037, 156129, 162082, 39856, 92828, 36218, 40834, 171630, 22348, 72125, 125898, 146021, 633, 163968, 175621, 177736, 157354, 169124, 172, 31481, 103343, 66587, 123536, 85037, 93, 98778, 35677, 198994, 54138, 154203, 155821, 148949, 28023, 8098, 242, 394, 200147, 127023, 100470, 160499, 70323, 147183, 127067, 204583, 27162, 146652, 129437, 127398, 140620, 45, 125618, 943, 110327, 129622, 1, 143884, 176558, 96848, 172503, 101721, 174451, 133798, 197457, 202760, 194466, 200504, 143092, 142359, 157333, 463, 205059, 139030, 191543, 590, 151347, 185279, 176920, 105593, 172386, 144325, 181304, 126042, 194879, 147949, 156336, 30549, 161936, 150658, 121073, 163412, 29805, 143403, 117663, 2651, 3076, 91536, 12, 28143, 40210, 66121, 34499, 177639, 41114, 128882, 51, 179719, 4324, 121921, 132531, 175754, 139147, 127024, 130827, 99437, 9220, 158900, 128667, 8217, 169786, 189052, 108745, 188834, 25021, 3889, 24068, 157969, 204305, 2511, 20551, 77130, 92415, 40692, 38453, 63268, 166384, 147020, 182631, 166702, 166707, 166704, 166708, 164153, 187645, 1917, 123260, 93260, 92190, 2653, 96323, 138745, 85990, 142334, 133473, 146508, 189035, 193527, 213099, 180585, 189686, 123991, 70919, 24508, 120677, 167791, 182028, 53953, 116998, 9209, 14996, 42, 1353, 121408, 102680, 81850, 233078, 12493, 95802, 22821, 12333, 2223, 128621, 183394, 9609, 22038, 48979, 150312, 25821, 164265, 3243, 113924, 176189];

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
  // recherche des boardgame deja joué
  var boardgames = new Set(
    plays.map((play) => play.boardgame_xmlapi_id)
  );
  // ajout des autres boardgame de la collection
  for(var id of boardgameIDS) {
    boardgames.add(id);
  }
  var promises = [];
  var pause = 1;
  for (var boardgameid of boardgames) {
    setTimeout((id) => {
      promises.push(pBoardgame(id));
    }, 1500*pause, boardgameid);
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
