angular.module('datingApp')
  .directive('mapView', ['LocationService', function(LocationService) {
    return {
      restrict: 'E',
      replace: true,
      template: '<div id="map" style="height: 400px;"></div>',
      scope: {
        users: '=',
        onUserSelect: '&'
      },
      link: function(scope, element, attrs) {
        var map;
        var markers = [];
        var currentLocationMarker;
        
        // Initialize map
        function initMap(coords) {
          // Create map
          map = L.map('map').setView([coords.latitude, coords.longitude], 13);
          
          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          
          // Add current location marker
          var currentLocationIcon = L.icon({
            iconUrl: 'assets/img/current-location.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          });
          
          currentLocationMarker = L.marker([coords.latitude, coords.longitude], {
            icon: currentLocationIcon
          }).addTo(map);
          currentLocationMarker.bindPopup('Your location').openPopup();
          
          // Wait for users to be loaded
          scope.$watch('users', function(newUsers) {
            addUsersToMap(newUsers);
          });
        }
        
        // Add user markers to map
        function addUsersToMap(users) {
          // Clear existing markers
          markers.forEach(function(marker) {
            map.removeLayer(marker);
          });
          markers = [];
          
          if (!users || users.length === 0) return;
          
          // Add markers for each user
          users.forEach(function(user) {
            if (user.location && user.location.coordinates.length === 2) {
              var lat = user.location.coordinates[1];
              var lng = user.location.coordinates[0];
              
              var userIcon = L.icon({
                iconUrl: 'assets/img/user-marker.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
              });
              
              var marker = L.marker([lat, lng], {
                icon: userIcon
              }).addTo(map);
              
              marker.bindPopup(user.name + ', ' + user.age);
              marker.on('click', function() {
                scope.$apply(function() {
                  scope.onUserSelect({ user: user });
                });
              });
              
              markers.push(marker);
            }
          });
        }
        
        // Initialize map with current location
        LocationService.getCurrentPosition()
          .then(function(coords) {
            initMap(coords);
          })
          .catch(function(error) {
            console.error('Error getting location:', error);
            // Default to a generic location if geolocation fails
            initMap({ latitude: 40.7128, longitude: -74.0060 });
          });
      }
    };
  }]);