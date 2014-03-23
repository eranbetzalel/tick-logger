var util = require('util')
  , net = require('net')
  , log = require('../core/util/clusterLogger')
  , Feeder = require('./feeder')
  , Tick = require('../models/tick');

exports = module.exports = TcpPushFeeder;

function TcpPushFeeder(name, options) {
  Feeder.call(this, name, options);
}

util.inherits(TcpPushFeeder, Feeder);

TcpPushFeeder.prototype.onFeederStart = function () {
  var self = this;

  var TickParser =
    require('./parsers/' + this.options.dataType.toLowerCase() + 'TickParser');

  this.tickParser = new TickParser();

  var tcpServer =
    net.createServer(function(socket) {
      log.info(
        '%s: accepted new connection (%s:%d).', 
        self.name, socket.remoteAddress, socket.remotePort);

      socket.on('data', function (data) {
        self.tickParser.Parse(data, function (instrumentName, tick) {
          self.processTick(instrumentName, tick);
        });
      });

      socket.on('close', function() {
        log.info('%s: connection closed.', self.name);
      });
    });

  tcpServer.on('error', function (e) {
    log.error('%s: server closed due to %s.', self.name, e.message);

    if(self.retryTimeoutHandle)
      return;

    if(!self.options.serverRetryInterval)
      return;

    self.retryTimeoutHandle =
      setTimeout(function () {
        tcpServer.close();
        tcpServer.listen(self.options.serverBindPort, self.options.serverBindHost);
      }, self.options.serverRetryInterval);
  });

  tcpServer.on('listening', function () {
    self.retryTimeoutHandle = null;

    var serverAddress = tcpServer.address();

    log.info('%s: server listening on %s:%d.', self.name, serverAddress.address, serverAddress.port);
  });

  tcpServer.listen(this.options.serverBindPort, this.options.serverBindHost);

  this.tcpServer = tcpServer;
}

TcpPushFeeder.prototype.onFeederStop = function () {
  if(!this.tcpServer)
    return;

  this.tcpServer.close(function () {
    log.info('%s: server closed.', this.name);
  });
}