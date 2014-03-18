exports.loadAdapters = function (adaptersConfiguration, adapterTypePath) {
  var adapters = [];

  for(adapterInstanceName in adaptersConfiguration) {
    var adapterConfig = adaptersConfiguration[adapterInstanceName];

    var AdapterClass = require(adapterTypePath + '/' + adapterConfig.type);

    var adapter = new AdapterClass(adapterInstanceName, adapterConfig.options);

    adapter.start();

    adapters.push(adapter);
  }

  return adapters;
}