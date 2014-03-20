var http = require('http')
  , express = require('express')
  , log = require('./core/util/clusterLogger')
  , config = require('./config')
  , TickEngine = require('./tickEngine');

var app = express();

app.configure(function () {
  app.use(express.logger('dev'));
  app.use(express.favicon('public/favicon.ico'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.session({secret: config.sessionSecret}));
  app.use(app.router);
  app.use(express.errorHandler());
});

var tickEngine = new TickEngine();

tickEngine.start();

app.get('/api/instruments', function (req, res) {
  tickEngine.queryStore.getInstrumentNamesByQuery(req.query.query, function (instrumentNames) {
    res.json(instrumentNames);
  });
});

app.get('/api/:instrumentName/ticks', function (req, res) {
  if(!req.query.from) {
    res.statusCode = 404;

    return res.send('Missing start date.');
  }

  if(!req.query.to) {
    res.statusCode = 404;

    return res.send('Missing end date.');
  }

  tickEngine.queryStore.getTicks(
    req.params.instrumentName, 
    req.query.from, 
    req.query.to,
    function (ticks) {
      res.json(ticks);
    });
});

http.createServer(app).listen(config.httpPort, function() {
  log.info('Tick Logger web server started on http://localhost:' + config.httpPort + '.');
});