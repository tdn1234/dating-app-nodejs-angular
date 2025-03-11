angular.module('datingApp')
  .factory('UserService', ['$http', 'AuthService', function($http, AuthService) {
    var service = {};
    
    // Configure headers with authentication token
    function getConfig() {
      return {
        headers: {
          'Authorization': 'Bearer ' + AuthService.getToken()
        }
      };
    }
    
    service.getProfile = function() {
      return $http.get('/api/users/profile', getConfig())
        .then(function(response) {
          return response.data;
        });
    };
    
    service.updateProfile = function(userData) {
      return $http.put('/api/users/profile', userData, getConfig())
        .then(function(response) {
          if (response.data.token) {
            AuthService.saveToken(response.data.token);
            AuthService.saveUser(response.data);
          }
          return response.data;
        });
    };
    
    return service;
  }]);