define([
  'angular',
  'filters',
  'services',
  'controllers',
  'angularRoute',
  'highchartsDirective',
  'autoCompleteDirective'
  ], function () {
    'use strict';

    return angular.module('tickLoggerApp', [
      'ngRoute',
      'tickLoggerApp.controllers',
      'tickLoggerApp.filters',
      'tickLoggerApp.services',
      'highcharts-ng',
      'autoComplete-ng'
    ]);
});