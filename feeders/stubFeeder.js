var util = require('util')
  , Feeder = require('./feeder')
  , Tick = require('../models/tick');

exports = module.exports = StubFeeder;


function StubFeeder(name, options) {
  Feeder.call(this, name, options);
}

util.inherits(StubFeeder, Feeder);

StubFeeder.prototype.onFeederStart = function () {
  this.tickGenerators = [];

  for(var i = 0;i < this.options.numberOfInstruments;i++) {
    var instumentName = this.options.instrumentBaseName + '_' + i;

    this.addTickGenerator(instumentName);
  }
}

StubFeeder.prototype.onFeederStop = function () {
  tickGenerators.forEach(clearInterval);
}

StubFeeder.prototype.addTickGenerator = function (instrumentName) {
  var self = this;

  var tickGenerator =
    setInterval(function () {
      var tick = new Tick({
        amount: Math.floor((Math.random() * 1000) + 10),
        price: Math.random() * 5
      });

      self.processTick(instrumentName, tick);
    }, this.options.tickGenerationInterval);

  this.tickGenerators.push(tickGenerator);
}