var cluster = require('cluster')
  , packageJson = require('./package.json')
  , config = require('./config')
  , log = require('./core/util/clusterLogger');

var appTitle = 'Tick Logger Server v' + packageJson.version + ' (PID:' + process.pid + ')';

process.title = appTitle;

log.info('Starting %s...', appTitle);

cluster.setupMaster({
  exec : 'appNode.js',
});

for (var i = 0; i < config.numberOfWorkers; i++) {
  cluster.fork();
}
 
cluster.on('exit', function(worker, code, signal) {
  log.warn(
    'Worker (PID: %d) died (%s) - restarting...',
    worker.process.pid, signal || code);
  cluster.fork();
});

cluster.on('online', function(worker) {
  log.info('Worker (PID: %d) started.', worker.process.pid);
});