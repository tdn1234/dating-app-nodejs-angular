angular.module('datingApp')
  .controller('MessagesController', ['$scope', '$routeParams', 'MatchService', 'MessageService', 'AuthService',
    function($scope, $routeParams, MatchService, MessageService, AuthService) {
    
    $scope.matches = [];
    $scope.currentMatch = null;
    $scope.messages = [];
    $scope.newMessage = '';
    $scope.error = '';
    $scope.loading = true;
    $scope.currentUser = AuthService.getUser(); // Add current user from AuthService
    
    // Load all matches
    function loadMatches() {
      MatchService.getMatches()
        .then(function(matches) {
          $scope.matches = matches;
          $scope.loading = false;
          
          // If matchId parameter exists, load that conversation
          if ($routeParams.matchId) {
            var match = matches.find(function(m) {
              return m._id === $routeParams.matchId;
            });
            
            if (match) {
              $scope.selectMatch(match);
            }
          }
        })
        .catch(function(err) {
          $scope.error = err.data.message || 'Failed to load matches';
          $scope.loading = false;
        });
    }
    
    loadMatches();
    
    $scope.selectMatch = function(match) {
      $scope.currentMatch = match;
      $scope.loadMessages(match._id);
    };
    
    $scope.loadMessages = function(matchId) {
      MessageService.getMessages(matchId)
        .then(function(messages) {
          $scope.messages = messages;
          // Scroll to bottom of messages
          setTimeout(function() {
            var chatContainer = document.querySelector('.chat-container');
            if (chatContainer) {
              chatContainer.scrollTop = chatContainer.scrollHeight;
            }
          }, 0);
        })
        .catch(function(err) {
          $scope.error = err.data.message || 'Failed to load messages';
        });
    };
    
    $scope.sendMessage = function() {
      if (!$scope.newMessage.trim() || !$scope.currentMatch) {
        return;
      }
      
      MessageService.sendMessage($scope.currentMatch._id, $scope.newMessage)
        .then(function(message) {
          $scope.messages.push(message);
          $scope.newMessage = '';
          // Scroll to bottom of messages
          setTimeout(function() {
            var chatContainer = document.querySelector('.chat-container');
            if (chatContainer) {
              chatContainer.scrollTop = chatContainer.scrollHeight;
            }
          }, 0);
        })
        .catch(function(err) {
          $scope.error = err.data.message || 'Failed to send message';
        });
    };
  }]);