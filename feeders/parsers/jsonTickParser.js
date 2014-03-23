var util = require('util')
  , Tick = require('../../models/tick')
  , TextTickParser = require('./textTickParser');

exports = module.exports = JsonTickParser;

function JsonTickParser() {
  TextTickParser.call(this, '\r\n');
}

util.inherits(JsonTickParser, TextTickParser);

JsonTickParser.prototype.ParseBlock = function (dataBlock, fn) {
  var tickInstrument = JSON.parse(dataBlock);

  var instrumentName = tickInstrument.instrument;
  var tick = new Tick(tickInstrument);

  fn(instrumentName, tick);
}