var cluster = require('cluster')
  , winston = require('winston');

//  TODO: add log configuration to config file
winston.remove(winston.transports.Console);

winston.add(winston.transports.Console, { 
  timestamp: getTimeStamp,
  colorize: true
});

winston.add(winston.transports.File, {
  timestamp: getTimeStamp,
  filename: './logs/TickLogger-log.txt',
  maxsize: 10 * 1024 * 1024,
  maxFiles: 5,
  json: false
});

//  Process workers log message requests
if(cluster.isMaster) {
  cluster.on('online', function(worker) {
    worker.on('message', function(message) {
      var logMessage = message.log;

      if (!logMessage)
        return;

      winston.log.apply(this, logMessage);
    });
  });
}

Object.keys(winston.levels).forEach(function (level) {
  if(cluster.isMaster) {
    //  Master will actually perform logging
    exports[level] = function () {
      var logMessageArray = createLogMessageArray(level, arguments);

      winston.log.apply(this, logMessageArray);
    }
  }
  else {
    //  Workers will send log request to master
    exports[level] = function () {
      var logMessageArray = createLogMessageArray(level, arguments);

      process.send({ log: logMessageArray });
    }
  }
});

function getTimeStamp () {
  return new Date().toISOString().replace('T', ' ').replace('Z', '');
}

function createLogMessageArray(level, args) {
  var fnArguments = Array.prototype.slice.call(args, 0);

  fnArguments[0] = '[' + process.pid + '] ' + fnArguments[0];

  return [ level ].concat(fnArguments);
}