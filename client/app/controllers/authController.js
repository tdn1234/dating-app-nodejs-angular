angular.module('datingApp')
  .controller('AuthController', ['$scope', 'AuthService', '$location', 
    function($scope, AuthService, $location) {
    
    $scope.user = {};
    $scope.error = '';
    
    $scope.register = function() {
      AuthService.register($scope.user)
        .then(function(user) {
          $location.path('/profile');
        })
        .catch(function(err) {
          $scope.error = err.data.message || 'Registration failed';
        });
    };
    
    $scope.login = function() {
      AuthService.login($scope.user)
        .then(function(user) {
          $location.path('/browse');
        })
        .catch(function(err) {
          $scope.error = err.data.message || 'Login failed';
        });
    };
    
    // Redirect if already logged in
    if (AuthService.isAuthenticated()) {
      $location.path('/browse');
    }
  }]);