//this is an angular js app and controller
//read up on angular here: http://angularjs.org/
var app = angular.module("App", []);

//ng-enter (/public/app/ngEnter.js) is an angular directive, for more information
//on creating directives: http://docs.angularjs.org/guide/directive
NgEnter.add(app);

app.controller("AppCtrl", function($scope, $http) {

  $scope.customers =  [];
  $scope.name = "";
  $scope.number = "";

  $scope.tableReady = function(customer) {
    console.log(customer);
    $http.post('/checkin', customer).success(function() {
      
    });
  };

  $scope.checkin = function() {
    $scope.customers.push({ name: $scope.name, number: $scope.number, waiterNumber: "" });

    $scope.name = "";
    $scope.number = "";

  };


});
