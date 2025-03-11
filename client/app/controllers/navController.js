angular.module('datingApp')
.controller('NavController', ['$scope', '$location', 'AuthService', 'MatchService', 
  function($scope, $location, AuthService, MatchService) {
  
  $scope.currentUser = AuthService.getUser();
  $scope.pendingCount = 0;
  
  $scope.isAuthenticated = function() {
    return AuthService.isAuthenticated();
  };
  
  $scope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
  };
  
  $scope.logout = function() {
    AuthService.logout();
    $location.path('/');
  };
  
  // Load pending match count if authenticated
  if ($scope.isAuthenticated()) {
    MatchService.getPendingMatches()
      .then(function(matches) {
        $scope.pendingCount = matches.length;
      });
  }
}]);
