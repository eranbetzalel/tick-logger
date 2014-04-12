define(['angular', 'socketIo'], function (angular, io) {
  'use strict';

  return angular.module('tickLoggerApp.services', [])
    .service('WebApiService', ['$http' ,function (http) {
      this.getInstruments = function (query) {
        return http.get('/api/instruments?query=' + (query == null ? '' : query));
      }

      this.getTicks = function (instrumentName, fromDate, toDate) {
        return http.get('/api/'+instrumentName+'/ticks?from=' + fromDate + '&to=' + toDate);
      }

      this.getLiveTicks = function (instrumentName, onNewTick) {
        var liveTicksSocket = io.connect('/liveTicks');

        liveTicksSocket.emit('subscribe', instrumentName);

        liveTicksSocket.on('tick', function (tick) {
          onNewTick(tick);
        });
      }
    }]);
});