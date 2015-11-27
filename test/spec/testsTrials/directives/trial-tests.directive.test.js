/**
 * Created by makombe on 11/26/15.
 */

describe('active directive', function () {
  var scope, $compile;

  beforeEach(module('app.testsTrial'));
  beforeEach(inject(function($rootScope, _$compile_) {
    scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  it('should display "Active" if passed true', function() {
    var element = '<blog-status is-active="blogArticle.active"></blog-status>';
    scope.blogArticle = { active: true };
    element = $compile(element)(scope);
    scope.$digest();

  //  expect(element.isolateScope().activeDisplayName).to.equal('Active');
   // scope.activeDisplayName().should.equal('Active');
  });
});
