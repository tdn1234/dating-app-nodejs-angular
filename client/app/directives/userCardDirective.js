angular.module('datingApp')
  .directive('userCard', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        user: '=',
        onLike: '&',
        onSkip: '&'
      },
      template: `
        <div class="user-card">
          <div class="text-center">
            <img ng-src="{{ user.avatar || 'assets/img/default-avatar.jpg' }}" 
                 class="img-circle" style="width: 100px; height: 100px;">
            <h3>{{ user.name }}, {{ user.age }}</h3>
          </div>
          
          <p>{{ user.bio || 'No bio available' }}</p>
          
          <h4>Interests</h4>
          <p>
            <span class="label label-primary" ng-repeat="interest in user.interests" 
                  style="margin-right: 5px;">{{ interest }}</span>
            <span ng-if="!user.interests || user.interests.length === 0">No interests listed</span>
          </p>
          
          <div class="text-center" style="margin-top: 15px;">
            <button class="btn btn-success" ng-click="onLike({userId: user._id})">
              <span class="glyphicon glyphicon-heart"></span> Like
            </button>
            <button class="btn btn-default" ng-click="onSkip({userId: user._id})">
              <span class="glyphicon glyphicon-remove"></span> Skip
            </button>
          </div>
        </div>
      `
    };
  });