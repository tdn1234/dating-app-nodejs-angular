angular.module('datingApp')
  .factory('LocationService', ['$http', 'AuthService', function($http, AuthService) {
    var service = {};
    
    // Configure headers with authentication token
    function getConfig() {
      return {
        headers: {
          'Authorization': 'Bearer ' + AuthService.getToken()
        }
      };
    }
    
    service.updateLocation = function(coords) {
      return $http.put('/api/location', coords, getConfig())
        .then(function(response) {
          return response.data;
        });
    };
    
    service.getNearbyUsers = function() {
      return $http.get('/api/location/nearby', getConfig())
        .then(function(response) {
          return response.data;
        });
    };
    
    service.getCurrentPosition = function() {
      var deferred = $.Deferred();
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            deferred.resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          function(error) {
            deferred.reject(error);
          }
        );
      } else {
        deferred.reject('Geolocation not supported');
      }
      
      return deferred.promise();
    };
    
    return service;
  }]);