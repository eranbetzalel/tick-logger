define(['angular'], function (angular) {
  'use strict';

  return angular.module('tickLoggerApp.services', [])
    .service('WebApiService', ['$http' ,function (http) {
      this.getInstruments = function (query) {
        return http.get('/api/instruments?query=' + query);
      }

      this.getTicks = function (instrumentName, fromDate, toDate) {
        return http.get('/api/'+instrumentName+'/ticks?from=' + fromDate + '&to=' + toDate);
      }
    }]);
});