//Used for sending post requests
var transform = function(data){
        return $.param(data);
};

angular.module("mainApp",['ngRoute','ngFileUpload'])

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
	.when('/explore-item', {
		templateUrl:'/explore-item',
		controller:'itemExploreController',
		controllerAs:"itemExplore"
	})
	.when('/appliedjobs', {
		templateUrl:'/appliedjobs',
		controller:'dashboardController',
		controllerAs:"dashboard"
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


.factory('GetUserData', function ($http) {

	var dataService = {};

	dataService.all = function() {
		return $http.post('/getprofileinfo');
	};

	return dataService;

})


.factory('SaveUserData', function ($http) {

	var dataService = {};

	dataService.saveData = function(data) {
		console.log('Save: ', data);
		return $http.post('/updateprofile', data);
	};

	return dataService;

})


.factory('GetWorkImages', function ($http) {

	var dataService = {};

	dataService.all = function(data) {
		return $http.post('/getworkimages');
	};

	return dataService;

})

.factory('GetJobs', function ($http) {

	var dataService = {};

	dataService.all = function(data) {
		return $http.get('/getjobs');
	};

	return dataService;

})



.controller("mainController",function(GetUserName, GetUserData, GetJobs, $scope,$anchorScroll,Upload,$timeout, $scope) {

	var vm = this;

	var socket = io();
    var user = Math.random();//prompt("Enter your username");
    vm.user_ = user;
	//page tab
	vm.page = "dashboard";

	vm.userName = "";

/*	GetUserName.all()
	.success(function(data){
		vm.userName = data.user;
		console.log(vm.userName)
	})*/


	// Get all data from database
	var getUserData = function() {
		GetUserData.all()
			.success(function(data){
				vm.userName = data.firstname;
				$scope.userLogo = data.avatar;
				console.log(data);
				//$scope.$apply();
			});
	}();

	vm.closeChatWindow = function(id) {
		$(id).hide();
	}

	vm.openChatWindow = function(id) {
		$(id).show();
	}

	vm.users = [
		{
			id: 1,
			name: "Johan",
			messages: [
				{
					sender:"Zack",
					msg: "Hello man!"
				},
				{
					sender:"Zack",
					msg: "What's wrong!"
				}
			]
		},
		{
			id: 2,
			name: "Zack",
			messages: [
				{
					sender:"Tito",
					msg: "You too!"
				}
			]
		},
		{
			id: 3,
			name: "Sarah",
			messages: []
		}
	];

	vm.sendMessage = function(e,id,identifier) {
		if(e.keyCode==13) {

			console.log($(id).val())
			if($(id).val()!="") {
				$(id).val="this is it"
				socket.emit('chat message', {'message':$(id).val(),'user':user, 'id':id, 'identifier':identifier});
		        $('#m').val('');
		        $(id).val("");
		        $(id).text("");
			}
			
		}
	}

	vm.sendPrivate = function(e,id,identifier) {
		if(e.keyCode==13) {
			if($(id).val()!="") {
				$(id).val="this is it"
				socket.emit('chat message', {'message':$(id).val(),'user':user, 'id':id, 'identifier':identifier});
		        $('#m').val('');
		        $(id).val("");
		        $(id).text("");
			}
		}
	}

	socket.on('chat message', function(msg){
		
    		for(i=0;i<vm.users.length;i++) {
    			if(vm.users[i].id==msg.identifier) {
    				var push_data = {sender:msg.user, msg: msg.message};
    				vm.users[i].messages.push(push_data);
    				console.log("pushed")
    				$scope.$apply();
    			}
    		
    		//updateScroll(msg.id);


    	}
		$('#msgs').append('<li class="recieved"><div class="message-item"><div class="messge">' + msg.message + '</div><div class="text-right"><span class="time">Sent '+msg.time+'</span></div></div></li>');

	});
	
	function updateScroll(id){
	    var element = $(id);
	    element.scrollTop = element.scrollHeight;
	    /*var element = document.getElementById("chat-msgs");
	    element.scrollTop = element.scrollHeight;*/
	}

	/*vm.uploadFiles = function(file, errFiles) {
        vm.f = file;
        vm.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/uploadprofile',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    vm.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }   
    }*/

    vm.applied_jobs1 = [];
    vm.num_of_applied_jobs = function() {
    	return vm.applied_jobs1.length;
    }



/*	$scope.userLogo = '';
	GetUserData.all()
		.success(function(data){
			$scope.userLogo = data.avatar;
		});*/

})

.controller("exploreController",function() {
	var vm = this;
})

.controller("profileController",function(GetUserData, GetWorkImages, SaveUserData, $timeout,$window,$scope,Upload) {

	var vm = this;
	/**
	 * User data initialization
	 * @type {{}}
     */

	$scope.userData = {};
	$scope.dataEditVisible = {
		'job': false,
		'address': false,
		'topSkills': false,
		'summary': false
	};


	// Get all data from database
	var getUserData = function() {
		GetUserData.all()
			.success(function(data){
				setUserData(data);
				console.log(data);
			});
	}();

	// Set data from database
	var setUserData = function (data) {
		$scope.userData = {
			'name': data.firstname + ' ' + data.lastname,
			'address': data.address,
			'job': data.job,
			'avatar': data.avatar,
			'topSkills': data.topskills || [],
			'summary': data.summary
		};
		$scope.$parent.userLogo = data.avatar;
	};

	function setUserImage (data) {
		$scope.userData.avatar = data.url;

		SaveUserData.saveData($scope.userData)
			.success(function (data) {
				console.log(data);
			});
	}

	// Watch for changes in input fields
	$scope.profileEditAction = function (evt, key) {
		var keyCode = evt.keyCode;

		// Enter pressed
		if (keyCode === 13) {
			$scope.dataEditVisible[key] = false;
			SaveUserData.saveData($scope.userData)
				.success(function (data) {
					console.log(data);
				});
		}
	};

	// Add new skill
	$scope.newSkillValue = '';
	$scope.addNewTopSkill = function (evt) {
		var keyCode = evt.keyCode;

		// Enter pressed
		if (keyCode === 13) {

			$scope.dataEditVisible['topSkills'] = false;
			var skills = $scope.newSkillValue.split(",");	//create array from string
			skills.forEach(function(element) {element.trim()});	//delete white spaces
			console.log(skills)

			if($scope.userData.topSkills==undefined || $scope.userData.topSkills==null || $scope.userData.topSkills=="") {
				$scope.userData.topSkills = [];
			}

			skills.forEach(function(element) {
			$scope.userData.topSkills.push(element);	
			});
			
			$scope.newSkillValue = '';
			console.log($scope.userData);
			SaveUserData.saveData($scope.userData)
			.success(function (data) {
				console.log(data);
			});
		}
	};

	// Edit summary
	$scope.editSummary = function (evt) {
		var keyCode = evt.keyCode;
		var summaryValue = document.getElementById('summary-edit');

		// Enter pressed
		if (keyCode === 13) {
			$scope.userData.summary = summaryValue.value;
			$scope.dataEditVisible['summary'] = false;

			SaveUserData.saveData($scope.userData)
				.success(function (data) {
					console.log(data);
				});
		}
	};



	/**
	 * Work section
	 * */
	$scope.workImages = [];
	$scope.workGalleryVisible = false;

	// Get images from database
	var getWorkImages = function () {

		GetWorkImages.all()
			.success(function (data) {
				$scope.workImages = data.images;
			});
	}();

	// Open gallery
	$scope.openWorkGallery = function () {
		$scope.workGalleryVisible = true;
	};

	// Close gallery
	$scope.closeWorkGallery = function () {
		$scope.workGalleryVisible = false;
	};

	// Move images
	$scope.selectedImage = 0;
	$scope.moveImages = function (side) {

		if (side === 'left') {
			$scope.selectedImage--;
			if ($scope.selectedImage < 0) {
				$scope.selectedImage = $scope.workImages.length-1;
			}
		}

		if (side === 'right') {
			$scope.selectedImage++;
			if ($scope.selectedImage === $scope.workImages.length) {
				$scope.selectedImage = 0;
			}
		}

	};

	function testFun (url) {
		console.log('wAAAT', url)
	}

	// Upload image
	vm.uploadFiles = function(file, errFiles) {
		console.log("Upload");
        vm.f = file;
        vm.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/uploadprofile',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    console.log(file.result);
					setUserImage(file.result);
                    vm.profile_image =  file.result.url;
                    console.log(vm.profile_image);

                    $scope.userData.avatar = vm.profile_image;
                	$scope.$parent.userLogo = vm.profile_image;
                	console.log($scope)
                	console.log($scope.userData.avatar)

                    $scope.$apply();

                });
            }, function (response) {
				if (response.status > 0)
                    vm.errorMsg = response.status + ': ' + response.data;
                	
            }, function (evt) {
				file.progress = Math.min(100, parseInt(100.0 *
                                         evt.loaded / evt.total));
            });
        }   
    }

})

.controller("messageController",function() {

	var vm = this;

	//messages tab
	vm.messages = "all";

	vm.friends = [];	//Array for friends conversation management..friends,status,conversations


})

.controller("dashboardController",function(GetZIPs,GetUserData,GetJobs,$scope) {

	var vm = this;

	//dashboard tabs - urgent and sidejob
	vm.tab = "urgent"
	//categories
	vm.categories = ["Personal","Automotive","Beauty","Repair","Technical","Creative","Event","Financial","Household","Legal","Lessons","Pets","Web"];

/*	vm.jobs = [
		{
			id:1,
			title: "Sidejob",
			owner: "Sam Jones",
			description: "This is first filtering",
			categories: ["Personal","Automotive","Beauty"],
			ZIP: 10000
		},
		{
			id:2,
			title: "Sidejob",
			owner: "John Lenon",
			description: "How to finish the job in time,starting today",
			categories: ["Household","Legal","Lessons"],
			ZIP: 10001
		},
		{
			id:3,
			title: "Sidejob",
			owner: "Simon Tower",
			description: "How to give inspiration the right way Design",
			categories: ["Creative","Event","Financial"],
			ZIP: 10002
		},
		{
			id:4,
			title: "Sidejob",
			owner: "Simon Tower 3",
			description: "How to give inspiration the right way Design",
			categories: ["Creative","Event","Financial"],
			ZIP: 10002
		},
		{
			id:5,
			title: "Sidejob",
			owner: "Simon Tower 2",
			description: "How to give inspiration the right way Design",
			categories: ["Creative","Event","Financial"],
			ZIP: 10002
		}
	];*/

	vm.getJobs = function() {
		GetJobs.all()
		.success(function(data) {
			vm.jobs = data;
			console.log(vm.jobs)
			vm.filter_applied_jobs();
		})
	}
	vm.getJobs();

	vm.applied = [];
	vm.rejected = [];

	vm.applied_jobs = [];
	vm.rejected_jobs = [];

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

	$scope.toggleFilters = function () {
		$('#first-filter').toggle(200);
	}

	vm.search_filter = '';
	vm.search = function(name) {
		if(name.search(vm.search_filter)!=-1) {
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

	vm.filter_applied_jobs = function() {
		vm.applied_jobs = [];
		var found = false;
		//$scope.$parent.main.applied_jobs1 = [];
		for(i=0;i<vm.jobs.length;i++) {
			for(j=0;j<vm.applied.length;j++) {
				if(vm.jobs[i].id==vm.applied[j].id) {
					console.log("Adding element " + vm.jobs[i].id + " " + vm.applied[j].id)
					vm.applied_jobs.push(vm.jobs[i]);
					$scope.$parent.main.applied_jobs1 = vm.applied_jobs;
					break

				}
			}
	
		}
		
		console.log(vm.applied_jobs);
		console.log($scope.$parent.main)
	}

console.log($scope.$parent.main)

	vm.apply = function(id) {
		var found = false;
		vm.applied.some(function(element) {
			if(element.id==id) {
				found=true;
			}
			
		})
		if(!found) {
			vm.applied.push({id:id});
			console.log("applied")
			vm.filter_applied_jobs();
		}
		else {
			console.log("already exists!");
		}
		
	}
	vm.reject = function(id) {
		var found = false;
		vm.rejected.some(function(element) {
			if(element.id==id) {
				found=true;
			}
			
		})
		if(!found) {
			vm.rejected.push({id:id});
			console.log("rejected")
			//vm.filter_rejected_jobs();
		}
		else {
			console.log("already exists!");
		}
	}

	vm.unsubscribe = function(id) {
		vm.applied.some(function(element,i,arr) {
			if(element.id==id) {
				vm.applied.splice(i,1);
			}
		})
		console.log(vm.applied)
		vm.filter_applied_jobs();

		
	}

	vm.isAppliedOrRejected = function(id) {
		var found = false;
		vm.applied.some(function(element) {
			if(element.id==id) {
				found = true;
			}
		})
		vm.rejected.some(function(element) {
			if(element.id==id) {
				found = true;
			}
		})
		return found;
	}

	$scope.userLogo = '';
	GetUserData.all()
	.success(function(data){
		$scope.userLogo = data.avatar;
	});

	vm.postJobModal = function() {
		$('#postjob_modal').modal('show');
		console.log("modal show")
	}

});

/* JS Snippet for Tabs (not sure where to put it?) */
    
    $(document).ready(function(){
        $('body').on('click','.egtab-handler',function(){
            $('.egtab-handler').removeClass('active');
            var tabcontID = $(this).attr('data-egtabtarget');
            $('.egtab-content').hide();
            $('#'+tabcontID).show();
            $(this).addClass('active');
        });
    });