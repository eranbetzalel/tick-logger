var log = require('./util/clusterLogger');

exports = module.exports = Adapter;

function Adapter(name, options) {
  this.name = name;
  this.options = options || {};
}

Adapter.prototype.start = function () {
  if(this.state === 'started') {
    log.warn('%s: has already started.', this.name);

    return;
  }

  log.debug(this.toString()  + ' starting...');

  try {
    this.onStart && this.onStart();
  }
  catch(e) {
    log.error(
      '%s: failed to start.\r\n%s', this.name, e.toString());

    return;
  }

  this.state = 'started';

  log.info(this.toString()  + ' started.');
}

Adapter.prototype.stop = function () {
  if(this.state === 'stopped') {
    log.warn('%s: has already stopped.', this.name);

    return;
  }

  log.debug(this.toString()  + ' stopping...');

  try {
    this.onStop && this.onStop();
  }
  catch(e) {
    log.error(
      '%s: failed to stop.\r\n%s', this.name, e.toString());

    return;
  }

  this.state = 'stopped';

  log.info(this.toString()  + ' stopped.');
}

Adapter.prototype.toString = function () {
  return this.name;
}