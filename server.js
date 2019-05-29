// load librairies
const express      = require('express');
const cors         = require('cors');
const mongoose     = require('mongoose');
const bodyParser   = require('body-parser');
const morgan       = require('morgan');
const swaggerTools = require('swagger-tools');
const YAML         = require('yamljs');
const config       = require('./config'); // get our config file

// register all models
require('./api/models/boardgameModel');
require('./api/models/playModel');
require('./api/models/playerModel');
require('./api/models/placeModel');
require('./api/models/userModel');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// use morgan to log requests to the console
app.use(morgan('dev'));

mongoose.Promise = global.Promise;
mongoose.connect(
  config.database,
  { 
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

const swaggerDoc = YAML.load('./doc/bgapi.yml');
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
});

const boardgameRoutes = require('./api/routes/boardgameRoutes');
boardgameRoutes(app);
const playRoutes = require('./api/routes/playRoutes');
playRoutes(app);
const playerRoutes = require('./api/routes/playerRoutes');
playerRoutes(app);
const placeRoutes = require('./api/routes/placeRoutes');
placeRoutes(app);
const userRoutes = require('./api/routes/userRoutes');
userRoutes(app);
const systemRoutes = require('./api/routes/systemRoutes');
systemRoutes(app);
const databaseRoutes = require('./api/routes/databaseRoutes');
databaseRoutes(app);

app.get('/', function(req, res) {
  res.redirect('/docs');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;

app.listen(port);

console.log('Boardgames RESTful API server started on: ' + port);
