'use strict';

// Define the main module
angular.module('datingApp', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/home.html',
        controller: 'HomeController'
      })
      .when('/register', {
        templateUrl: 'app/views/register.html',
        controller: 'AuthController'
      })
      .when('/login', {
        templateUrl: 'app/views/login.html',
        controller: 'AuthController'
      })
      .when('/profile', {
        templateUrl: 'app/views/profile.html',
        controller: 'ProfileController',
        resolve: { authenticate: authenticate }
      })
      .when('/browse', {
        templateUrl: 'app/views/browse.html',
        controller: 'BrowseController',
        resolve: { authenticate: authenticate }
      })
      .when('/matches', {
        templateUrl: 'app/views/matches.html',
        controller: 'MatchesController',
        resolve: { authenticate: authenticate }
      })
      .when('/messages', {
        templateUrl: 'app/views/messages.html',
        controller: 'MessagesController',
        resolve: { authenticate: authenticate }
      })
      .when('/messages/:matchId', {
        templateUrl: 'app/views/conversation.html',
        controller: 'MessagesController',
        resolve: { authenticate: authenticate }
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .run(['$rootScope', '$location', 'AuthService', function($rootScope, $location, AuthService) {
    // Listen for route changes to check authentication
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (next.resolve && next.resolve.authenticate && !AuthService.isAuthenticated()) {
        $location.path('/login');
      }
    });
  }]);

// Authentication check function for route resolve
function authenticate($q, $location, AuthService) {
  if (AuthService.isAuthenticated()) {
        return $q.when();
    } else {
        $location.path('/login');
        return $q.reject();
    }
}