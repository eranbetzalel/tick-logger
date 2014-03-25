require.config({
  paths: {
    jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min',
    angular: '//code.angularjs.org/1.2.14/angular',
    angularRoute: '//code.angularjs.org/1.2.14/angular-route',
    moment: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min',
    highstock: '//code.highcharts.com/stock/highstock.src',
    autoCompleteDirective: 'directives/autoComplete',
    highchartsDirective: 'directives/highcharts-ng'
  },
  shim: {
    angular: {'exports' : 'angular'},
    angularRoute: ['angular'],
    highstock: ['jquery'],
    highchartsDirective: ['angular', 'highstock']
  },
  priority: [
    "angular"
  ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
  'angular',
  'app',
  'routes'
], function(angular, app) {
  'use strict';

  angular.element().ready(function() {
    angular.resumeBootstrap([app['name']]);
  });
});