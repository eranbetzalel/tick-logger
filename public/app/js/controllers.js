define(['angular', 'services', 'moment', 'jquery'], function (angular, services, moment, $) {
  'use strict';

  //  TODO: move it to a utility module?
  var timezoneOffsetMilli = (new Date()).getTimezoneOffset() * -1  * 60 * 1000;

  function toLocalTime (date) {
    return date + timezoneOffsetMilli;
  }

  function getColorByInstrumentName (instrumentName) {
    var colors = [
      '#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
      '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'];

    var chosenColor = colors[getStringHashCode(instrumentName) % colors.length]

    return chosenColor;
  }

  function getStringHashCode(str) {
    var res = 0;
    var len = str.length;

    for (var i = 0; i < len; i++)
      res = res * 31 + str.charCodeAt(i);

    return res;
  };

  var TicksQueryCtrl = function ($scope, api) {
    $scope.updateInstrumentNames = function (typed) {
      api.getInstruments(typed).success(function (instrumentNames) {
        $scope.instrumentNames = instrumentNames;
      });
    }
  };

  return angular.module('tickLoggerApp.controllers', ['tickLoggerApp.services'])
    .controller('NavigationCtrl', ['$scope', '$location', function ($scope, $location) {

      $scope.isCurrentPath = function (path) {
        return $location.path() === path;
      };
    }])

    .controller('HistoryCtrl', ['$scope', '$injector', 'WebApiService', function ($scope, $injector, api) {

      $injector.invoke(TicksQueryCtrl, this, {$scope: $scope, api: api});

      $scope.fromDate = moment().format('YYYY-MM-DD');
      $scope.toDate = moment().add('days', 1).format('YYYY-MM-DD');

      $scope.chartConfig = {
        useHighStocks: true
      }

      $scope.chartConfig.noData = 'No ticks data to display';

      $scope.plotGraph = function () {
        if(!$scope.instrumentName || !$scope.fromDate || !$scope.toDate)
          return alert('Please fill-in all query data.');

        var fromDateUtc = moment($scope.fromDate).utc().valueOf();
        var toDateUtc = moment($scope.toDate).utc().valueOf();

        $scope.chartConfig.loading = true;

        $scope.chartConfig.title = null;
        $scope.chartConfig.series = [];

        api.getTicks($scope.instrumentName, fromDateUtc, toDateUtc).success(function (ticks) {

          $scope.chartConfig.title = $scope.instrumentName + ' Stock Price';

          $scope.chartConfig.series.push({
            name: $scope.instrumentName,
            color: getColorByInstrumentName($scope.instrumentName),
            data: ticks.map(function (tick) {
              tick[0] = toLocalTime(tick[0]);

              return tick;
            })
          });

          $scope.chartConfig.loading = false;
        });
      }
    }])

    .controller('GraphCtrl', ['$scope', '$injector', 'WebApiService', function ($scope, $injector, api) {
      $injector.invoke(TicksQueryCtrl, this, {$scope: $scope, api: api});

      $('#tickGraph').highcharts('StockChart', {
        rangeSelector: {
          buttons: [{
            count: 1,
            type: 'minute',
            text: '1M'
          }, {
            count: 5,
            type: 'minute',
            text: '5M'
          }, {
            type: 'all',
            text: 'All'
          }],
          inputEnabled: false,
          selected: 0
        },
        series : [{
          name : 'Random data',
          data : []
        }]
      });

      var chart = $('#tickGraph').highcharts();

      $scope.plotGraph = function () {
        if(!$scope.instrumentName)
          return alert('Please choose an instrument.');

        var instrumentSeries = {
          name: $scope.instrumentName,
          color: getColorByInstrumentName($scope.instrumentName),
          data: []
        };

        chart.setTitle($scope.instrumentName + ' Stock Price', false);
        chart.addSeries(instrumentSeries, false, false);

        chart.showLoading('Waiting for ticks data...');

        var receivedTicks = 0;

        api.getLiveTicks($scope.instrumentName, function (tick) {
          var shouldShift = receivedTicks > 100;

          chart.series[0].addPoint([toLocalTime(tick.createdAt), tick.price], true, shouldShift, false);

          receivedTicks++;

          if(receivedTicks > 0)
            chart.hideLoading();
        });
      }
    }])

    .controller('StatisticsCtrl', ['$scope', function ($scope) {
    }])
});