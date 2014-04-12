var http = require('http')
  , express = require('express')
  , log = require('./core/util/clusterLogger')
  , config = require('./config')
  , TickEngine = require('./tickEngine')
  , liveTicksService = require('./liveTicksService');

process.on('uncaughtException', function (err) {
  log.error('An uncaught exception occurred.\r\n' + err.stack);
});

var app = express();

app.configure(function () {
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.favicon('public/favicon.ico'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.session({secret: config.sessionSecret}));
  app.use(app.router);
  app.use(express.errorHandler());
});

var appServer = http.createServer(app);

var tickEngine = new TickEngine();

tickEngine.start();

liveTicksService.listen(appServer);

app.get('/api/instruments', function (req, res) {
  tickEngine.queryStore.getInstrumentNamesByQuery(req.query.query, function (instrumentNames) {
    res.json(instrumentNames.sort().slice(0, 10));
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

  //  TODO: use chuncked data
  //  TODO: use Google's protobuf
  tickEngine.queryStore.getTicks(
    req.params.instrumentName, 
    req.query.from, 
    req.query.to,
    function (ticks) {
      if(!ticks)
        return res.json([]);

      var ticksDTO =
        ticks.map(function (tick) {
          return [ tick.createdAt, tick.price ];
        });

      res.json(ticksDTO);
    });
});

appServer.listen(config.httpPort, function() {
  log.info('Tick Logger web server started on http://localhost:' + config.httpPort + '.');
});