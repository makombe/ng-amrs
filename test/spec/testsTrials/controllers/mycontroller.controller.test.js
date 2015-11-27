/**
 * Created by makombe on 11/25/15.
 */
describe('MyController', function(){
  beforeEach(module('app.testsTrial'));
  var myController,scope;

  describe('addSong()', function(){
    it('should handle add songs correctly', inject(function($controller){
      scope ={};
      myController = $controller('MyController',{
        $scope:scope});

      function addSong(a){

        //'While My Guitar Gently Weeps'
        scope.songs.should.contain('While My Guitar Gently Weeps');

      }


    }));
  });

  describe('getNames()', function(){
    it('should handle names correctly', inject(function($controller){
      scope ={};
      myController = $controller('MyController',{
        $scope:scope});

        scope.firstName = 'George';
        scope.lastName = 'Harrison';
       scope.getNames().should.equal('George Harrison');
    }));
  });

  describe('addNumbers()', function(){
    it('should handle add numbers correctly', inject(function($controller){
      scope ={};
      myController = $controller('MyController',{
        $scope:scope});

      scope.addNumbers(4,5).should.equal(9);

    }));
  });

  describe('mockingHttp()', function(){
    it('should handle mockingHttp correctly', inject(function($controller,$httpBackend){
      scope ={};

      myController = $controller('MyController',{
        $scope:scope});
      function mockingHttp(){

        $httpBackend
          .when('GET', '/api/music')
          .respond([
            'vocals', 'guitar', 'sitar'
          ]);
        $httpBackend.flush();

        scope.music.should.equal('guitar');

      }
    }));
  });

});
