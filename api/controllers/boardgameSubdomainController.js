'use strict';
//https://www.boardgamegeek.com/xmlapi2/plays?username=cbouche
var mongoose = require('mongoose');

var Boardgame = mongoose.model('Boardgames');

exports.list = function(req, res) {
  Boardgame.find({},{
    subdomain: 1
  }, function(err, boardgames) {
    if (err)
      res.send(err);

    let tmp = [];
    for (var i = 0; i < boardgames.length; i++) {
        tmp.push(boardgames[i].subdomain);
    }
    tmp.sort();
    let subdomains = [tmp[0]];
    for(var i = 1; i < tmp.length; i++) {
      if (tmp[i-1] !== tmp[i]) {
        subdomains.push(tmp[i]);
      }
    }

    res.json(subdomains);
  });
};
