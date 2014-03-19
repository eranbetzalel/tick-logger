var config = {
  httpPort: parseInt(process.env.PORT, 10) || 8080,
  sessionSecret: 'DefaultSecret',
  queryStoreName: 'Test Store',

  feeders: {
    'Test Feeder' : { 
      type: 'stubFeeder',
      options: {
        instrumentBaseName: 'Test',
        numberOfInstruments: 10,
        tickGenerationInterval: 10
      }
    }
  },

  stores: {
    'Test Store' : { 
      type: 'memoryStore',
      options: {
        limitTicksPerInstrument : 500
      }
    }
  }
}

module.exports = config;