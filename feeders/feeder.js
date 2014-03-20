var util = require('util')
  , cluster = require('cluster')
  , config = require('../config')
  , pubsub = require('../core/util/pubsub')
  , Adapter = require('../core/adapter');

exports = module.exports = Feeder;

var workerProcessKey = config.workerStartIndex + (cluster.worker.id % config.numberOfWorkers);
var processInstrumentNames = {};
var publishTick = pubsub.createTopicPublisher('tick');

function Feeder(name, options) {
  Adapter.call(this, name, options);

  if(this.options.verifyTickOrder)
    this.lastReceivedTickDate = Date.now();
}

util.inherits(Feeder, Adapter);

Feeder.prototype.onStart = function () {
  this.onFeederStart && this.onFeederStart();
}

Feeder.prototype.processTick = function (instrumentName, tick) {
  if(!this.shouldProcessInstrumentName(instrumentName))
    return;

  if(this.options.verifyTickOrder && this.lastReceivedTickDate > tick.createdAt)
    return;

  publishTick(instrumentName, tick);
}

Feeder.prototype.shouldProcessInstrumentName = function (instrumentName) {
  var shouldProcess = processInstrumentNames[instrumentName];

  if(shouldProcess == null) {
    shouldProcess = 
      getStringHashCode(instrumentName) % config.totalNumberOfWorkers === workerProcessKey;

    processInstrumentNames[instrumentName] = shouldProcess;
  }

  return shouldProcess;
}

Feeder.prototype.onStop = function () {
  this.onFeederStop && this.onFeederStop();
}

function getStringHashCode(str) {
  var res = 0;
  var len = str.length;

  for (var i = 0; i < len; i++)
    res = res * 31 + str.charCodeAt(i);

  return res;
};