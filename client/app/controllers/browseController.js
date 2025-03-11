angular.module('datingApp')
  .controller('BrowseController', ['$scope', 'LocationService', 'MatchService', 'AuthService', 
    function($scope, LocationService, MatchService, AuthService) {
    
    $scope.nearbyUsers = [];
    $scope.error = '';
    $scope.selectedUser = null;
    $scope.loading = true;
    $scope.currentUser = AuthService.getUser(); // Add current user from AuthService
    
    // Update user location and find nearby users
    LocationService.getCurrentPosition()
      .then(function(coords) {
        return LocationService.updateLocation(coords);
      })
      .then(function() {
        return LocationService.getNearbyUsers();
      })
      .then(function(users) {
        $scope.nearbyUsers = users;
        $scope.loading = false;
      })
      .catch(function(err) {
        $scope.error = 'Failed to load nearby users: ' + (err.message || err);
        $scope.loading = false;
      });
    
    $scope.selectUser = function(user) {
      $scope.selectedUser = user;
    };
    
    $scope.likeUser = function(userId) {
      MatchService.createMatch(userId)
        .then(function() {
          // Remove from list
          $scope.nearbyUsers = $scope.nearbyUsers.filter(function(user) {
            return user._id !== userId;
          });
          
          if ($scope.selectedUser && $scope.selectedUser._id === userId) {
            $scope.selectedUser = null;
          }
        })
        .catch(function(err) {
          $scope.error = err.data.message || 'Failed to like user';
        });
    };
    
    $scope.skipUser = function(userId) {
      // Just remove from the list
      $scope.nearbyUsers = $scope.nearbyUsers.filter(function(user) {
        return user._id !== userId;
      });
      
      if ($scope.selectedUser && $scope.selectedUser._id === userId) {
        $scope.selectedUser = null;
      }
    };
    
    // Add refresh function to reload nearby users
    $scope.refresh = function() {
      $scope.loading = true;
      $scope.error = '';
      
      LocationService.getCurrentPosition()
        .then(function(coords) {
          return LocationService.updateLocation(coords);
        })
        .then(function() {
          return LocationService.getNearbyUsers();
        })
        .then(function(users) {
          $scope.nearbyUsers = users;
          $scope.loading = false;
        })
        .catch(function(err) {
          $scope.error = 'Failed to load nearby users: ' + (err.message || err);
          $scope.loading = false;
        });
    };
  }]);