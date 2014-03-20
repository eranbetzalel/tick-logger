var log = require('./util/clusterLogger');

exports = module.exports = Adapter;

function Adapter(name, options) {
  this.name = name;
  this.options = options || {};
}

Adapter.prototype.start = function () {
  log.debug(this.toString()  + ' starting...');

  this.onStart && this.onStart();

  log.info(this.toString()  + ' started.');
}

Adapter.prototype.stop = function () {
  log.debug(this.toString()  + ' stopping...');

  this.onStop && this.onStop();

  log.info(this.toString()  + ' stopped.');
}

Adapter.prototype.toString = function () {
  return this.name;
}