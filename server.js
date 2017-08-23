var express      = require('express');
var cors         = require('cors');
var mongoose     = require('mongoose');
var bodyParser   = require('body-parser');
var morgan       = require('morgan');
var swaggerTools = require('swagger-tools');
var YAML         = require('yamljs');
var config       = require('./config'); // get our config file

var Boardgame = require('./api/models/boardgameModel');
var Play = require('./api/models/playModel');
var Player = require('./api/models/playerModel');
var Place = require('./api/models/placeModel');
var User = require('./api/models/userModel');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

mongoose.Promise = global.Promise;
mongoose.connect(
  config.database,
  {
    useMongoClient: true
  }
);

var swaggerDoc   = YAML.load('./doc/bgapi.yml');
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
});

var boardgameRoutes = require('./api/routes/boardgameRoutes');
boardgameRoutes(app);
var playRoutes = require('./api/routes/playRoutes');
playRoutes(app);
var playerRoutes = require('./api/routes/playerRoutes');
playerRoutes(app);
var placeRoutes = require('./api/routes/placeRoutes');
placeRoutes(app);
var userRoutes = require('./api/routes/userRoutes');
userRoutes(app);
var systemRoutes = require('./api/routes/systemRoutes');
systemRoutes(app);
var searchRoutes = require('./api/routes/miningRoutes');
searchRoutes(app);

var port = process.env.PORT || 3000;

app.listen(port);

console.log('Boardgames RESTful API server started on: ' + port);
