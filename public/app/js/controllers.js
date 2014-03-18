define(['angular', 'services', 'moment'], function (angular, services, moment) {
  'use strict';

  return angular.module('tickLoggerApp.controllers', ['tickLoggerApp.services'])
    .controller('NavigationCtrl', ['$scope', '$location', function ($scope, $location) {

      $scope.isCurrentPath = function (path) {
        return $location.path() === path;
      };
    }])

    .controller('HistoryCtrl', ['$scope', '$http', 'WebApiService', function ($scope, $http, api) {

      $scope.fromDate = moment().format('YYYY-MM-DD');
      $scope.toDate = moment().add('days', 1).format('YYYY-MM-DD');

      $scope.updateInstrumentNames = function (typed) {
        api.getInstruments(typed).success(function (instrumentNames) {
          $scope.instrumentNames = instrumentNames;
        });
      }

      $scope.plotGraph = function () {
        if(!$scope.instrumentName || !$scope.fromDate || !$scope.toDate)
          return alert('Please fill-in all query data.');

        var fromDateUtc = moment.utc($scope.fromDate).valueOf();
        var toDateUtc = moment.utc($scope.toDate).valueOf();

        $scope.chartConfig.loading = true;

        $scope.chartConfig.title = null;
        $scope.chartConfig.series = [];

        api.getTicks($scope.instrumentName, fromDateUtc, toDateUtc).success(function (ticks) {
          
          $scope.chartConfig.title = $scope.instrumentName + ' Stock Price';
          
          $scope.chartConfig.series.push({
            name: $scope.instrumentName,
            data: ticks
          });

          $scope.chartConfig.loading = false;
        });
      }

      $scope.chartConfig = {
        useHighStocks: true
      }
    }])

    .controller('GraphCtrl', ['$scope', function ($scope) {
    }])

    .controller('StatisticsCtrl', ['$scope', function ($scope) {
    }])
});