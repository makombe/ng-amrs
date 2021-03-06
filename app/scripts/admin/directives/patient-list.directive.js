/* global angular */
/*
 jshint -W003, -W026
 */
(function () {
  'use strict';

  angular
    .module('app.admin')
    .directive('patientList', directive);

  function directive() {
    return {
      restrict: "E",
      scope: {
        locationUuid: "@",
        startDate: "@",
        endDate: "@",
        indicator: "@"
      },
      controller: patientListController,
      link: patientListLink,
      templateUrl: "views/admin/patient-list.html"
    };
  }

  patientListController.$inject =
    ['$scope', '$rootScope', 'EtlRestService', 'PatientEtlModel', '$state', 'OpenmrsRestService', 'moment',
      'HivSummaryIndicatorService'];

  function patientListController($scope, $rootScope, EtlRestService, PatientEtlModel, $state, OpenmrsRestService,
                                 moment, HivSummaryIndicatorService) {

    //non-function types scope members
    $scope.patients = [];
    $scope.isBusy = false;
    $scope.experiencedLoadingErrors = false;
    $scope.currentPage = 1;
    $scope.startDate = HivSummaryIndicatorService.getStartDate();
    $scope.endDate = HivSummaryIndicatorService.getEndDate();

    //function types scope members
    $scope.loadPatientList = loadPatientList;
    $scope.loadPatient = loadPatient;
    $scope.loadIndicatorView = loadIndicatorView;
    $scope.getIndicatorDetails = getIndicatorDetails;

    //Pagination Params
    $scope.nextStartIndex = 0;
    $scope.allDataLoaded = false;

    //load data
    loadPatientList();

    function loadPatient(patientUuid) {
      OpenmrsRestService.getPatientService().getPatientByUuid({uuid: patientUuid},
        function (data) {
          $rootScope.broadcastPatient = data;
          $state.go('patient', {uuid: patientUuid});

        });
    }

    function loadIndicatorView() {
      $state.go('admin.hiv-summary-indicators.indicator');
    }

    function loadPatientList(loadNextOffset) {
      $scope.experiencedLoadingErrors = false;
      if ($scope.isBusy === true) return;
      if(loadNextOffset!==true)resetPaging();
      $scope.isBusy = true;
      if ($scope.locationUuid && $scope.locationUuid !== '' && $scope.indicator && $scope.indicator !== ''
        && $scope.startDate && $scope.startDate !== '') {
        EtlRestService.getPatientListByIndicator($scope.locationUuid,
          moment(new Date($scope.startDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          moment(new Date($scope.endDate)).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          $scope.indicator, onFetchPatientsListSuccess, onFetchPatientsListError, $scope.nextStartIndex, 300);
      }
      else {
        $scope.experiencedLoadingErrors = true;
        $scope.isBusy = false;
      }
    }

    function resetPaging(){
      $scope.nextStartIndex = 0;
      $scope.patients = [];
      $scope.allDataLoaded = false;
    }


    function onFetchPatientsListSuccess(patients) {
      $scope.isBusy = false;
      console.log("Sql query for PatientList request=======>", patients.sql, patients.sqlParams);

      //update pagination parameters
      if (patients.size === 0){
        $scope.allDataLoaded = true;
      }else{
        $scope.patients.length!=0?$scope.patients.push.apply($scope.patients,PatientEtlModel.toArrayOfModels(patients.result)):
          $scope.patients = PatientEtlModel.toArrayOfModels(patients.result);
        $scope.nextStartIndex +=  patients.size;
      }
    }

    function onFetchPatientsListError(error) {
      $scope.isBusy = false;
      $scope.experiencedLoadingErrors = true;
    }

    function getIndicatorDetails() {
      return HivSummaryIndicatorService.getIndicatorDetails();
    }
    }

  function patientListLink(scope, element, attrs, vm) {
    scope.onLoadPatientList = function () {

    }
  }
})();
