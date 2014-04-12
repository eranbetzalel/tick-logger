define([
  'angular',
  'services',
  'controllers',
  'angularRoute',
  'autoCompleteModule',
  'highchartsModule'
  ], function () {
    'use strict';

    return angular.module('tickLoggerApp', [
      'ngRoute',
      'tickLoggerApp.controllers',
      'tickLoggerApp.services',
      'highcharts-ng',
      'autocomplete'
    ]);
});