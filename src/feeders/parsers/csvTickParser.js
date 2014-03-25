var util = require('util')
  , Tick = require('../../models/tick')
  , TextTickParser = require('./textTickParser');

exports = module.exports = CsvTickParser;

function CsvTickParser() {
  TextTickParser.call(this, '\r\n');
}

util.inherits(CsvTickParser, TextTickParser);

CsvTickParser.prototype.ParseBlock = function (dataBlock, fn) {
  var dataBlockParts = dataBlock.split(',');

  if(dataBlockParts != 2)
    throw new Error('Invalid CSV data.');

  var instrumentName = dataBlockParts[0];
  var tick = new Tick({ price: dataBlockParts[1] });

  fn(instrumentName, tick);
}