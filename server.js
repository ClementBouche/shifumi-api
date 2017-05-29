var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Boardgame = require('./api/models/boardgameModel');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Boardgamedb');

var routes = require('./api/routes/boardgameRoutes');
routes(app);

var port = process.env.PORT || 3000;

app.listen(port);

console.log('Boardgames RESTful API server started on: ' + port);
