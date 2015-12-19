//Used for sending post requests
var transform = function(data){
        return $.param(data);
};

angular.module("mainApp",['ngRoute'])

.config(function($routeProvider,$httpProvider) {
	$routeProvider.when('/message',{
		templateUrl:'/partial',
		controller:'messageController'
	})
	.when('/dashboard',{
		templateUrl:'/partial2',
		controller:'dashboardController',
		controllerAs:'dashboard'
	})
	.when('/explore', {
		templateUrl:'/explore',
		controller:'exploreController',
		controllerAs: 'explore'
	})
	.when('/profile', {
		templateUrl:'/profile',
		controller:'profileController',
		controllerAs: 'profile'
	})

	.otherwise({
		templateUrl:'/partial2',
		controller:'dashboardController',
		controllerAs:'dashboard'
	});

	$httpProvider.defaults.useXDomain = true; 
	delete $httpProvider.defaults.headers 
	.common['X-Requested-With']; 

})


.factory('GetZIPs', function($http) {

	var dataService = {};

	dataService.all = function(data) {
		return $http.get('http://www.zipcodeapi.com/rest/UiiIs4AU2TbW9GOfvlDdXabquFS0dsc7LvQeAr9Clkzu1nKwJoJGzV74A04OthVe/' + "radius.json" + "/" + data.ZIP + "/" + data.distance + "/" + data.unit);
	};
	
	return dataService;
})

.factory('GetUserName', function($http) {

	var dataService = {};

	dataService.all = function(data) {
		return $http.get('/f_name');
	};
	
	return dataService;
})




.controller("mainController",function(GetUserName) {

	var vm = this;

	//page tab
	vm.page = "dashboard";

	vm.userName = "";

	GetUserName.all()
	.success(function(data){
		vm.userName = data.user;
		console.log(vm.userName)
	})
	

})

.controller("exploreController",function() {
	var vm = this;
})

.controller("profileController",function() {
	var vm = this;
})

.controller("messageController",function() {

	var vm = this;

	//messages tab
	vm.messages = "all";

})

.controller("dashboardController",function(GetZIPs) {

	var vm = this;

	//dashboard tabs - urgent and sidejob
	vm.tab = "urgent"
	//categories
	vm.categories = ["Personal","Automotive","Beauty","Repair","Technical","Creative","Event","Financial","Household","Legal","Lessons","Pets","Web"];

	vm.jobs = [
		{
			title: "Sidejob",
			owner: "Sam Jones",
			description: "How to get inspire the right way Design modo",
			categories: ["Personal","Automotive","Beauty"],
			ZIP: 10000
		},
		{
			title: "Sidejob",
			owner: "John Lenon",
			description: "How to finish the job in time",
			categories: ["Household","Legal","Lessons"],
			ZIP: 10001
		},
		{
			title: "Sidejob",
			owner: "Simon Tower",
			description: "How to give inspiration the right way Design modo",
			categories: ["Creative","Event","Financial"],
			ZIP: 10002
		},
		{
			title: "Sidejob",
			owner: "Simon Tower 3",
			description: "How to give inspiration the right way Design modo 2",
			categories: ["Creative","Event","Financial"],
			ZIP: 10002
		},
		{
			title: "Sidejob",
			owner: "Simon Tower 2",
			description: "How to give inspiration the right way Design modo 3",
			categories: ["Creative","Event","Financial"],
			ZIP: 10002
		}
	];

	vm.zip_filter=0;

	vm.type=function(t) {
		console.log(vm.category_filter);
	}

	vm.zip_filtering = function(zip) {
		if(vm.zip_filter==0) {
			return true;
		}
		else if(vm.zip_filter==zip) {
			return true;
		}
		else {
			return false;
		}
	}

	vm.category_filter="";

	vm.category_filtering = function(categories) {
		if(vm.category_filter=="") {
			return true;
		}
		
		else {
			return categories.some(function(element,index,array) {
				return element==vm.category_filter;
			})
		}
	}

	vm.distance = 0;

	angular.element('.slider').on('slideStop',function(e) {
		if(vm.distance!=e.value) {
			vm.filterByZIP(e.value);
			vm.distance = e.value;
		}
		
	})

	vm.filterByZIP = function(distance) {
		
		var data = {distance: distance, ZIP: vm.zip_filter, unit: "mile"};
		
		GetZIPs.all(data)
		.success(function(data) {
			console.log(data);
		})
	}

})