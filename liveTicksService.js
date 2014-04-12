var socketIo = require('socket.io')
  , pubsub = require('./core/util/pubsub')

exports.listen = function (appServer) {
	var io = socketIo.listen(appServer);

	io.set('log level', 1);

	var ioLiveTicks = io.of('/liveTicks');

	ioLiveTicks.on('connection', function (socket) {
    socket.on('subscribe', function(instrumentName) {
     	socket.join(instrumentName);
   })
	});

  pubsub.subscribe('tick', function (instrumentName, tick) {
		ioLiveTicks.to(instrumentName).emit('tick', tick);
	});
}