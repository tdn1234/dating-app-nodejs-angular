angular.module('datingApp')
  .controller('MatchesController', ['$scope', 'MatchService', '$location', 'AuthService',
    function($scope, MatchService, $location, AuthService) {
    
    $scope.matches = [];
    $scope.pendingMatches = [];
    $scope.error = '';
    $scope.loading = true;
    $scope.currentUser = AuthService.getUser(); // Add current user from AuthService
    
    // Load matches
    function loadMatches() {
      MatchService.getMatches()
        .then(function(matches) {
          $scope.matches = matches;
          $scope.loading = false;
        })
        .catch(function(err) {
          $scope.error = err.data.message || 'Failed to load matches';
          $scope.loading = false;
        });
    }
    
    // Load pending match requests
    function loadPendingMatches() {
      MatchService.getPendingMatches()
        .then(function(matches) {
          $scope.pendingMatches = matches;
        })
        .catch(function(err) {
          $scope.error = err.data.message || 'Failed to load pending matches';
        });
    }
    
    loadMatches();
    loadPendingMatches();
    
    $scope.acceptMatch = function(matchId) {
      MatchService.updateMatchStatus(matchId, 'matched')
        .then(function() {
          loadMatches();
          loadPendingMatches();
        })
        .catch(function(err) {
          $scope.error = err.data.message || 'Failed to accept match';
        });
    };
    
    $scope.rejectMatch = function(matchId) {
      MatchService.updateMatchStatus(matchId, 'rejected')
        .then(function() {
          loadPendingMatches();
        })
        .catch(function(err) {
          $scope.error = err.data.message || 'Failed to reject match';
        });
    };
    
    $scope.goToConversation = function(matchId) {
      $location.path('/messages/' + matchId);
    };
  }]);