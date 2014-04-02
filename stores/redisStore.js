var util = require('util')
  , redis = require("redis")
  , Store = require('./store')
  , Tick = require('../models/tick')
  , log = require('../core/util/clusterLogger');

exports = module.exports = RedisStore;

function RedisStore(name, options) {
  Store.call(this, name, options);

  this.receivedInstrumentNames = {};
}

util.inherits(RedisStore, Store);

RedisStore.prototype.onStoreStart = function () {
  var self = this;

  var client =
    redis.createClient(
      this.options.port,
      this.options.host,
      { auth_pass: this.options.pass });

  client.on("error", function (err) {
    log.error('%s: %s', self.name, err.toString());
  });

  client.smembers('instruments', function (err, reply) {
    if(err) return;

    reply.forEach(function (instrumentName) {
      self.receivedInstrumentNames[instrumentName] = true;
    });
  });

  this.client = client;
}

RedisStore.prototype.onTickReceived = function (instrumentName, tick) {
  if(!this.receivedInstrumentNames[instrumentName]) {
    var self = this;

    this.client.sadd('instruments', instrumentName, function (err, reply) {
      if(err) return;

      self.receivedInstrumentNames[instrumentName] = true;
    });
  }

  this.client.zadd(instrumentName, tick.createdAt, toRedisTick(tick));
}

RedisStore.prototype.getInstrumentNamesByQuery = function (query, fn) {
  var instrumentNames = Object.keys(this.receivedInstrumentNames);

  if(query)
    instrumentNames = 
      instrumentNames.filter(function (instrumentName) {
        return instrumentName.indexOf(query) == 0;
      });

  return fn(instrumentNames);
}

RedisStore.prototype.getTicks = function (instrumentName, fromDate, toDate, fn) {
  this.client.zrangebyscore(instrumentName, fromDate, toDate, 'WITHSCORES', function (err, reply) {
    if(err)
      return fn(null);

    var ticks = [];

    for(var i = 0; i < reply.length; i+=2) {
      ticks.push(fromRedisTick(reply[i], reply[i + 1]));
    }

    return fn(ticks);
  });
}

function toRedisTick(tick) {
  return tick.price;
}

function fromRedisTick(value, score) {
  return new Tick({ 
    price: parseFloat(value),
    createdAt: parseInt(score)
  });
}