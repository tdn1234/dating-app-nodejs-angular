angular.module('datingApp')
  .factory('MatchService', ['$http', 'AuthService', function($http, AuthService) {
    var service = {};
    
    // Configure headers with authentication token
    function getConfig() {
      return {
        headers: {
          'Authorization': 'Bearer ' + AuthService.getToken()
        }
      };
    }
    
    service.createMatch = function(targetUserId) {
      return $http.post('/api/matches', { targetUserId: targetUserId }, getConfig())
        .then(function(response) {
          return response.data;
        });
    };
    
    service.updateMatchStatus = function(matchId, status) {
      return $http.put('/api/matches/' + matchId, { status: status }, getConfig())
        .then(function(response) {
          return response.data;
        });
    };
    
    service.getMatches = function() {
      return $http.get('/api/matches', getConfig())
        .then(function(response) {
          return response.data;
        });
    };
    
    service.getPendingMatches = function() {
      return $http.get('/api/matches/pending', getConfig())
        .then(function(response) {
          return response.data;
        });
    };
    
    return service;
  }]);