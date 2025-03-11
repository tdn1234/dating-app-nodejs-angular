angular.module('datingApp')
  .controller('ProfileController', ['$scope', 'UserService', 'LocationService', 
    function($scope, UserService, LocationService) {
    
    $scope.user = {};
    $scope.error = '';
    $scope.success = '';
    $scope.isEditing = false;
    
    // Load user profile
    UserService.getProfile()
      .then(function(profile) {
        $scope.user = profile;
      })
      .catch(function(err) {
        $scope.error = err.data.message || 'Failed to load profile';
      });
    
    $scope.toggleEdit = function() {
      $scope.isEditing = !$scope.isEditing;
    };
    
    $scope.updateProfile = function() {
      UserService.updateProfile($scope.user)
        .then(function(profile) {
          $scope.success = 'Profile updated successfully';
          $scope.isEditing = false;
        })
        .catch(function(err) {
          $scope.error = err.data.message || 'Failed to update profile';
        });
    };
    
    $scope.updateLocation = function() {
      LocationService.getCurrentPosition()
        .then(function(coords) {
          return LocationService.updateLocation(coords);
        })
        .then(function(response) {
          $scope.success = 'Location updated successfully';
        })
        .catch(function(err) {
          $scope.error = 'Failed to update location: ' + (err.message || err);
        });
    };
  }]);