/**
 * Created by makombe on 11/23/15.
 */
(function(){
  angular
    .module('app.testsTrial')
    .directive('trialTest',directive);
  function directive(){
    return{
      restrict: 'E',

      scope:{
        isActive: '='

      },

      link: function($scope, $el, attrs) {
        if ($scope.isActive) {
          $scope.activeDisplayName = 'Active';
        } else {
          $scope.activeDisplayName = 'Inactive';
        }
      },
      templateUrl: "views/testsTrial/testTrial.html"

    };

  }


})();
