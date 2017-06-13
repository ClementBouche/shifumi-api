var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var Boardgame = require('./api/models/boardgameModel');
var Play = require('./api/models/playModel');
var Player = require('./api/models/playerModel');
var Place = require('./api/models/placeModel');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Boardgamedb');

var boardgameRoutes = require('./api/routes/boardgameRoutes');
boardgameRoutes(app);

var playRoutes = require('./api/routes/playRoutes');
playRoutes(app);

var playerRoutes = require('./api/routes/playerRoutes');
playerRoutes(app);

var placeRoutes = require('./api/routes/placeRoutes');
placeRoutes(app);

var searchRoutes = require('./api/routes/searchRoutes');
searchRoutes(app);

var updateRoutes = require('./api/routes/updateRoutes');
updateRoutes(app);

var systemRoutes = require('./api/routes/systemRoutes');
systemRoutes(app);

var port = process.env.PORT || 3000;

app.listen(port);

console.log('Boardgames RESTful API server started on: ' + port);
