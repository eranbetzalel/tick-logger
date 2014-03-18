define(['angular', 'app'], function(angular, app) {
  'use strict';

  return app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/history', {
      templateUrl: 'app/partials/history.html',
      controller: 'HistoryCtrl'
    });

    $routeProvider.when('/graph', {
      templateUrl: 'app/partials/graph.html',
      controller: 'GraphCtrl'
    });

    $routeProvider.when('/statistics', {
      templateUrl: 'app/partials/statistics.html',
      controller: 'StatisticsCtrl'
    });

    $routeProvider.otherwise({redirectTo: '/history'});
  }]);

});