angular.module('datingApp')
  .factory('MessageService', ['$http', 'AuthService', function($http, AuthService) {
    var service = {};
    
    // Configure headers with authentication token
    function getConfig() {
      return {
        headers: {
          'Authorization': 'Bearer ' + AuthService.getToken()
        }
      };
    }
    
    service.getMessages = function(matchId) {
      return $http.get('/api/messages/' + matchId, getConfig())
        .then(function(response) {
          return response.data;
        });
    };
    
    service.sendMessage = function(matchId, content) {
      return $http.post('/api/messages/' + matchId, { content: content }, getConfig())
        .then(function(response) {
          return response.data;
        });
    };
    
    return service;
  }]);
