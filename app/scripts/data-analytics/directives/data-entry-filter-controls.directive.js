/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

	angular
		.module('app.dataAnalytics')
		.directive('statsDataEntryFilters', directive);

	function directive() {
		return {
			restrict: "E",
			scope: {
				selectedForms: "=",
				startDate: "=",
				endDate: "=",
				startMonth: "=",
				endMonth: "=",
				selectedProvider: "=",
				selectedCreator: "=",
				selectedEncounterTypes: "=",
				enabledControls: "="

			},
			controller: dataEntryFilterController,
			link: dataEntryFilterLink,
			templateUrl: "views/data-analytics/data-entry-filter-controls.html"
		};
	}

	dataEntryFilterController.$inject = ['$scope', '$rootScope',
	'SearchDataService', 'moment', '$state', '$filter', 'CachedDataService',
	'UserResService','OpenmrsRestService','LocationModel' ];

    function dataEntryFilterController($scope, $rootScope, SearchDataService,
	moment, $state, $filter, CachedDataService, UserResService,OpenmrsRestService, LocationModel) {

    var locationService = OpenmrsRestService.getLocationResService();
    $scope.selectedLocations = {};
    $scope.selectedLocations.selectedAll = false;
    $scope.selectedLocations.locations = [];
    $scope.locations = [];
    $scope.selectingLocation = true;
    $scope.selectedView = '';
    $scope.isBusy = false;
    $scope.locationSelected = locationSelected;
   // $scope.fetchLocations = fetchLocations;

		$scope.forms = [];
		$scope.selectedForms = {};
		$scope.selectedForms.selected = [];
		$scope.selectedEncounterTypes = {};
		$scope.selectedEncounterTypes.selected = [];
		$scope.selectAllForms = selectAllForms;
		$scope.selectAllEncounterTypes = selectAllEncounterTypes;

		$scope.providers = [];
		$scope.creators = [];
		$scope.selectedProvider = {};
		$scope.selectedCreator = {};
		$scope.selectedProvider.selected = {};
		$scope.selectedCreator.selected = {};
		$scope.findProviders = findProviders;
		$scope.findingProvider = false;
		$scope.findCreators = findCreators;
		$scope.findingCreator = false;
		$scope.canView = canView;





      fetchLocations();

    function locationSelected() {
      $scope.selectingLocation = false;
      $scope.$parent.selectedLocations=$scope.selectedLocations;
      $scope.$parent.selectedLocations.locations=$scope.selectedLocations.locations;

      //broadcast here
      $rootScope.$broadcast('dataEntryStatsLocationSelected', true);
    }

    function fetchLocations() {
      $scope.isBusy = true;
      locationService.getLocations(onGetLocationsSuccess,
        onGetLocationsError, false);
    }

    function onGetLocationsSuccess(locations) {
      $scope.isBusy = false;
      $scope.locations = wrapLocations(locations);
      //$scope.selectedLocations.locations = $scope.locations;
    }

    function onGetLocationsError(error) {
      $scope.isBusy = false;
    }

    function wrapLocations(locations) {
      var wrappedLocations = [];
      for (var i = 0; i < locations.length; i++) {
        var wrapped = wrapLocation(locations[i]);
        wrapped.index = i;
        wrappedLocations.push(wrapped);
      }

      return wrappedLocations;
    }

    function wrapLocation(location) {
      return LocationModel.toWrapper(location);
    }

		loadForms();
		function loadForms() {
			$scope.forms = CachedDataService.getCachedPocForms();
		}

		function canView(param){
			return $scope.enabledControls.indexOf(param) > -1;
		}

		function selectAllForms() {
			if ($scope.forms)
				$scope.selectedForms.selected = $scope.forms;
		}

		function selectAllEncounterTypes() {
			if ($scope.forms)
				$scope.selectedEncounterTypes.selected = $scope.forms;
		}

		function findCreators(searchText) {

			$scope.creators = [];
			if (searchText && searchText !== ' ') {
				$scope.findingCreator = true;
				UserResService.findUser(searchText,
				onCreatorSearchSuccess, onCreatorSearchError);
			}
		}

		function onCreatorSearchSuccess(data) {
			$scope.findingCreator = false;
			$scope.creators = data;
		}

		function onCreatorSearchError(error) {
			$scope.findingCreator = false;
		}

		function findProviders(searchText) {

			$scope.providers = [];
			if (searchText && searchText !== ' ') {
				$scope.findingProvider = true;
				SearchDataService.findProvider(searchText,
				onProviderSearchSuccess, onProviderSearchError);
			}
		}

		function onProviderSearchSuccess(data) {
			$scope.findingProvider = false;
			$scope.providers = data;
		}

		function onProviderSearchError(error) {
			$scope.findingProvider = false;
		}
	}

	function dataEntryFilterLink(scope, element, attrs, vm) {

    }
})();
