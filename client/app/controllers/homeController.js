angular.module('datingApp')
.controller('HomeController', ['$scope', 'AuthService', '$location', 
  function($scope, AuthService, $location) {
  
  $scope.isAuthenticated = function() {
    return AuthService.isAuthenticated();
  };
  
  $scope.goToRegister = function() {
    $location.path('/register');
  };
  
  $scope.goToLogin = function() {
    $location.path('/login');
  };
  
  // Redirect if already logged in
  if ($scope.isAuthenticated()) {
    $location.path('/browse');
  }
}]);
