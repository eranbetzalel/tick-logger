var config = require('./config')
  , adapterFactory = require('./core/adapterFactory');

exports = module.exports = TickEngine;

function TickEngine() {
}

TickEngine.prototype.start = function () {
  this.feeders = adapterFactory.loadAdapters(config.feeders, '../feeders');
  this.stores = adapterFactory.loadAdapters(config.stores, '../stores');

  if(this.feeders.length == 0)
    throw "No feeders were configured.";

  if(this.stores.length == 0)
    throw "No stores were configured.";

  //  Defaults the ticks query store to the first store
  this.queryStore = this.stores[0];

  if(config.queryStoreName) {
    var queryStores = 
      this.stores.filter(function (store) { return store.name === config.queryStoreName; });
    
    if(queryStores.length > 0)
      this.queryStore = queryStores[0];
  }
}