var util = require('util')
  , log = require('winston')
  , pubsub = require('../core/util/pubsub')
  , Adapter = require('../core/adapter');

exports = module.exports = Feeder;

var publishTick;

function Feeder(name, options) {
  Adapter.call(this, name, options);

  if(this.options.verifyTickOrder)
    this.lastReceivedTickDate = Date.now();

  publishTick = pubsub.createTopicPublisher('tick');
}

util.inherits(Feeder, Adapter);

Feeder.prototype.onStart = function () {
  this.onFeederStart && this.onFeederStart();
}

Feeder.prototype.processTick = function (instrumentName, tick) {
  if(this.options.verifyTickOrder && this.lastReceivedTickDate > tick.createdAt)
    return;

  publishTick(instrumentName, tick);
}

Feeder.prototype.onStop = function () {
  this.onFeederStop && this.onFeederStop();
}