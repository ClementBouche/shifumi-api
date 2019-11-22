'use strict';

const mongoose = require('mongoose');
const Play = mongoose.model('Plays');
const Boardgame = mongoose.model('Boardgames');

const requestHelperService = require('../../services/requestHelperService');

const projection = {
  xmlapi_id: 1,
  boardgame_name: 1,
  date: 1,
  incomplete: 1,
  place_name: 1,
  playing_time: 1,
  scores: 1,
  boardgame_id: 1,
};

const listProjection = {
  xmlapi_id: 1,
  boardgame_name: 1,
  date: 1,
  incomplete: 1,
  place_name: 1,
  playing_time: 1,
  scores: 1,
  boardgame_id: 1,
};

const playerProjection = {
  _id: 1,
  name: 1,
  user_id: 1,
  // avatar
  avatar_image: 1,
  color_primary: 1,
  color_accent: 1,
  color_text: 1,
};

const boardgameProjection = {
  _id: 1,
  name: 1,
  thumbnail: 1,
  image: 1
};

exports.list = function(req, res) {
  const size = requestHelperService.getQuerySize(req, 10);
  const page = requestHelperService.getQueryPage(req);
  const skip = page * size ;

  Play.find({}, listProjection, {
    sort: { date: -1, _id: -1 },
    skip: skip,
    limit: size
  }).exec((err, result) => {
    if (err) return res.sendStatus(500);
    res.json(result);
  });
};


exports.create = function(req, res) {
  const new_play = new Play(req.body);
  // look for boardgame id
  Boardgame.findOne({
    name: new_play.boardgame_name
  }, function(err, boardgame) {
    const id = boardgame && boardgame._id ? boardgame._id : '';
    new_play.boardgame_id = id;

    const thumbnail = boardgame && boardgame.thumbnail ? boardgame.thumbnail : '';
    new_play.thumbnail = thumbnail;

    new_play.save(function(err, play) {
      if (err) return res.send(err);
      res.json(play);
    });
  });
};


exports.read = function(req, res) {
  const resultProjection = Object.assign({}, projection, {
    boardgame: boardgameProjection,
    scores: Object.assign({}, projection.scores, {player: playerProjection})
  });

  Play.aggregate()
    .match({ _id: mongoose.Types.ObjectId(req.params.playid) })
    .limit(1)
    // force conversion
    .addFields({ boardgame_id: { $toObjectId: "$boardgame_id" } })
    .lookup({ from: 'boardgames', localField: 'boardgame_id', foreignField: '_id', as: 'boardgame' })
    // .unwind('boardgame')
    .unwind('scores')
    .lookup({ from: 'players', localField: 'scores.player_name', foreignField: 'name', as: 'scores.player' })
    .project(resultProjection)
    .exec((err, result) => {
      if (err) return res.sendStatus(500);
      res.json(niceReadResponse(result));
    });
};


exports.update = function(req, res) {
  Play.findById(req.params.playid, {
    new: true
  }, function(err, play) {
    if (err) return res.send(err);
    // should this do the trick?
    const new_play = Object.assign(play, req.body);
    new_play.save(function(err, play) {
      if (err) return res.send(err);
      res.json(play);
    });
  });
};


exports.delete = function(req, res) {
  Play.deleteOne({
    _id: req.params.playid
  }, function(err, play) {
    if (err) return res.send(err);
    res.json({
      message: 'Play successfully deleted'
    });
  });
};

const niceReadResponse = function(aggregation) {
  console.log(aggregation);
  return aggregation.reduce((previous, current) => {
    if (!previous) {
      previous = current;
      const score = current.scores;
      // 'unwind' score.player
      score.player = score.player[0];
      previous.scores = [score];
      // 'unwind' play.boardgame
      previous.boardgame = current.boardgame[0];
      return previous;
    }
    const score = current.scores;
    // 'unwind' score.player
    score.player = score.player[0];
    previous.scores.push(score);
    console.log(current.scores);
    return previous;
  }, null);
}
