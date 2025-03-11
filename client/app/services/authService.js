angular.module('datingApp')
.factory('AuthService', ['$http', '$window', function($http, $window) {
  var service = {};
  
  // Store user credentials
  service.saveToken = function(token) {
    $window.localStorage['dating-app-token'] = token;
  };
  
  service.getToken = function() {
    return $window.localStorage['dating-app-token'];
  };
  
  service.saveUser = function(user) {
    $window.localStorage['dating-app-user'] = JSON.stringify(user);
  };
  
  service.getUser = function() {
    return JSON.parse($window.localStorage['dating-app-user'] || '{}');
  };
  
  service.isAuthenticated = function() {
    var token = service.getToken();
    return token ? true : false;
  };
  
  service.register = function(user) {
    return $http.post('/api/users', user)
      .then(function(response) {
        service.saveToken(response.data.token);
        service.saveUser(response.data);
        return response.data;
      });
  };
  
  service.login = function(credentials) {
    return $http.post('/api/users/login', credentials)
      .then(function(response) {
        service.saveToken(response.data.token);
        service.saveUser(response.data);
        return response.data;
      });
  };
  
  service.logout = function() {
    $window.localStorage.removeItem('dating-app-token');
    $window.localStorage.removeItem('dating-app-user');
  };
  
  return service;
}]);