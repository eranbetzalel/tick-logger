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
  tickGenerators.forEach(function (tickGenerator) {
    clearInterval(tickGenerator.timer);
  });
}

StubFeeder.prototype.addTickGenerator = function (instrumentName) {
  var self = this;

  var pipDecimals = this.options.pipDecimals || 4;
  var minPrice = this.options.minPrice || 1.2;
  var maxPrice = this.options.maxPrice || 1.3;
  var priceStep = this.options.priceStep || 0.001;

  var tickGenerator = {
    timer:
      setInterval(function () {
        var tick =
          generateTick(tickGenerator.lastTick, minPrice, maxPrice, priceStep, pipDecimals);

        self.processTick(instrumentName, tick);

        tickGenerator.lastTick = tick;
      }, this.options.tickGenerationInterval)
    };

  this.tickGenerators.push(tickGenerator);
}

function generateTick (lastTick, minPrice, maxPrice, priceStep, pipDecimals) {
  var price;

  if(lastTick) {
    var lastTickPrice = lastTick.price;
    var nextMaxPrice = lastTickPrice + priceStep;
    var nextMinPrice = lastTickPrice - priceStep;

    maxPrice = nextMaxPrice > maxPrice ? maxPrice : nextMaxPrice;
    minPrice = nextMinPrice < minPrice ? minPrice : nextMinPrice;
  }

  price = roundNumber(Math.random() * (maxPrice - minPrice) + minPrice, pipDecimals);

  return new Tick({ price: price });
}

function roundNumber (number, decimals) {
  var decimalsMultiplier = Math.pow(10, decimals);

  return (Math.round(number * decimalsMultiplier) / decimalsMultiplier);
}