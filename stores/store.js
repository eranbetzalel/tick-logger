var util = require('util')
  , log = require('winston')
  , pubsub = require('../core/util/pubsub')
  , Adapter = require('../core/adapter');

exports = module.exports = Store;

var tickUnsubscribe;

function Store(name, options) {
  Adapter.call(this, name, options);
}

util.inherits(Store, Adapter);

Store.prototype.onStart = function () {
  if(!this.onTickReceived)
    throw new Error('Store (' + this.toString + ') is missing onTickReceived method.');

  this.onStoreStart && this.onStoreStart();

  tickUnsubscribe = pubsub.subscribe('tick', this.onTickReceived, this);
}

Store.prototype.onStop = function () {
  if(tickUnsubscribe)
    tickUnsubscribe();

  this.onStoreStop && this.onStoreStop();
}