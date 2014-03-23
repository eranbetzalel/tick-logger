var util = require('util')
  , Store = require('./store')
  , TickCollection = require('../models/tickCollection');

exports = module.exports = MemoryStore;

function MemoryStore(name, options) {
  Store.call(this, name, options);
}

util.inherits(MemoryStore, Store);

MemoryStore.prototype.onStoreStart = function () {
  this.instrumentTicks = {};
}

MemoryStore.prototype.onTickReceived = function (instrumentName, tick) {
  var self = this;

  process.nextTick(function () {
    var instrumentTicks = self.instrumentTicks[instrumentName];
    
    if(!instrumentTicks) {
      instrumentTicks = new TickCollection(instrumentName, [ tick ]);

      self.instrumentTicks[instrumentName] = instrumentTicks;
    }

    if(!self.options.limitTicksPerInstrument || self.options.limitTicksPerInstrument > instrumentTicks.ticks.length) {
      instrumentTicks.append(tick);
    }
    else {
      instrumentTicks.shiftAppend(tick);
    }
  });
}

//  TODO: support clustered enviroment
MemoryStore.prototype.getInstrumentNamesByQuery = function (query, fn) {
  var instrumentNames = Object.keys(this.instrumentTicks);

  if(query)
    instrumentNames = 
      instrumentNames.filter(function (instrumentName) {
        return instrumentName.indexOf(query) == 0;
      });

  return fn(instrumentNames);
}

//  TODO: support clustered enviroment
MemoryStore.prototype.getTicks = function (instrumentName, fromDate, toDate, fn) {
  var self = this;

  process.nextTick(function () {
    var instrumentTicks = self.instrumentTicks[instrumentName];
    
    if(!instrumentTicks)
      return fn(null);

    var ticks = instrumentTicks.getTicksByDateRange(toDate, fromDate);

    return fn(ticks);
  });
}