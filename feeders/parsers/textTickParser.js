var log = require('../../core/util/clusterLogger');

exports = module.exports = TextTickParser;

//  TODO: add dataDelimiter to config
function TextTickParser(dataDelimiter) {
  if(!dataDelimiter || dataDelimiter === '')
    throw new Error('dataDelimiter cannot be empty.');

  this.parseBuffer = '';
  this.dataDelimiter = dataDelimiter;
}

TextTickParser.prototype.Parse = function (data, fn) {
  var dataDelimiter = this.dataDelimiter;

  var dataParts = data.toString().split(dataDelimiter);

  //  Incomplete data - nothing to parse here
  if(dataParts.length === 1) {
    this.parseBuffer += dataParts[0];

    return;
  }

  var self = this;

  //  Completing the data to the dataParts array
  dataParts[0] = this.parseBuffer + dataParts[0];

  process.nextTick(function () {
    for(var i = 0; i < dataParts.length - 1; i++) {
      try
      {
        self.ParseBlock(dataParts[i], fn);
      }
      catch(e)
      {
        log.error(
          'Falied to parse data (%s). Data = %s.',
          e.message,
          formatDataString(dataParts[i]));
      }
    }
  });

    //  The start of an incomplete data to parse
  self.parseBuffer = dataParts[dataParts.length - 1];
}

function formatDataString(str) {
  if(!str || str === '')
    return '[empty]';

  return str.replace(/[\s]/g, replaceEscape);
}

function replaceEscape(escape) {
  return '\\u' + ('0000' + escape.charCodeAt().toString(16)).slice(-4);
}