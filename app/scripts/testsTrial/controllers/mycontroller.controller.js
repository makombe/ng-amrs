/**
 * Created by makombe on 11/25/15.
 */

(function(){

  angular
    .module('app.testsTrial')
    .controller('MyController',MyController );
  MyController.$inject =['$scope','$http'];


   function MyController($scope,$http){
        var self = this;


     $scope.songs = [];
     $scope.firstName = "";
     $scope.lastName ="";
     addSong();

     //$scope.addSong = function(song) {
     //  $scope.songs.push(song);
     //};
     function addSong(song){
       $scope.songs.push(song);

     }

     $scope.getNames = function(){
       return $scope.firstName + ' ' + $scope.lastName;
     };
     $scope.addNumbers = function(a,b){
       return a + b;

     };

     $scope.mockingHttp = function(){
       $scope.music = ['drum'];
       $http.get('/api/music')
         .success(function(data){
           $scope.music = data;
         })

     };



       // return self;
      }

})();


