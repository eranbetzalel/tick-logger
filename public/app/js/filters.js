define(['angular'], function (angular) {
  'use strict';
  
  angular.module('tickLoggerApp.filters', [])
    .filter('highlight', function ($sce) {
      /* --- Made by justgoscha and licensed under MIT license --- */

      return function (input, searchParam) {
        if (searchParam) {
          var words = searchParam.split(/\ /).join('|'),
              exp = new RegExp("(" + words + ")", "gi");

          if (words.length) {
            input = $sce.trustAsHtml(input.replace(exp, "<span class=\"highlight\">$1</span>")); 
          }
        }

        return input;
      }
    });
});