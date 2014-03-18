var approximateBinarySearch = require('../core/util/algorithms.js').approximateBinarySearch;

exports = module.exports = TickCollection;

function TickCollection(instumentName, ticks) {
  this.instumentName = instumentName;
  this.ticks = ticks || [];
}

TickCollection.prototype.append = function (tick) {
  this.ticks.push(tick);
}

TickCollection.prototype.shiftAppend = function (tick) {
  this.ticks.shift();
  this.ticks.push(tick);
}

TickCollection.prototype.getTicksByDateRange = function (fromDate, toDate) {
  var firstTickIndex =
    approximateBinarySearch(fromDate, this.ticks, function tickDateCompare(tick) {
      return tick.createdAt - fromDate;
    });

  var lastTickIndex =
    approximateBinarySearch(toDate, this.ticks, function tickDateCompare(tick) {
      return tick.createdAt - toDate;
    });

  return this.ticks.slice(firstTickIndex, lastTickIndex);
}

