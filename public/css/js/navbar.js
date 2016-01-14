/* Custom toggle classes */
function toggleFirstMenu(){
			if($('#second-menu-content').hasClass('sidebar-toggle')){
				toggleSecondMenu();
			}

			$('#first-menu-content').toggleClass('sidebar-toggle');
		}

function toggleSecondMenu(){
			if($('#first-menu-content').hasClass('sidebar-toggle')){
				toggleFirstMenu();
			}
			$('#second-menu-content').toggleClass('sidebar-toggle');
			$('body').toggleClass('toggle-body');
}

// Merged morphsearch into navbar
// Last modified: 2015-04-03

jQuery(document).ready(function($){
	//if you change this breakpoint in the style.css file (or _layout.scss if you use SASS), don't forget to update this value as well
	var MQL = 768;

	var morphSearch = document.getElementById( 'morphsearch' );
	var morphSearchInput = morphSearch.querySelector( 'input.morphsearch-input' );
    var morphSearchClose = morphSearch.querySelector( 'span.morphsearch-close' );

	function closeCurrentPanel( current ) {
			classie.remove( current, 'menu-is-open' );
	}

	function openLeftPanel() {
		closeRightPanel();
		closeSearchPanel();

		$('.hub-header').addClass('leftnav-is-open');

	//in firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
		if( $('.hub-overlay-nav-left').hasClass('is-visible') ) {
			$('.hub-overlay-nav-left').removeClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
				$('body').removeClass('overflow-hidden');
			});
		} else {
			$('.hub-overlay-nav-left').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
				$('body').addClass('overflow-hidden');
			});	
		}
	}

	function openSearchPanel() {
		closeLeftPanel();
		closeRightPanel();
		/*$('.hub-header').addClass('search-is-open');
		$('#morphsearch').addClass('menu-is-open');*/

	}

	function openRightPanel() {
		closeLeftPanel();
		closeSearchPanel();
		$('.hub-header').addClass('rightnav-is-open');

		//in firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
		if( $('.hub-overlay-nav-right').hasClass('is-visible') ) {
				$('.hub-overlay-nav-right-caret').removeClass('is-visible');
				$('.hub-overlay-nav-right').removeClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
					$('body').removeClass('overflow-hidden');
				});
		} else {
			$('.hub-overlay-nav-right-caret').addClass('is-visible');
			$('.hub-overlay-nav-right').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
				
				$('body').addClass('overflow-hidden');
		
			});	
		}
	}


	function closeLeftPanel() {	
		$('.hub-header').removeClass('leftnav-is-open');
		//close left panel
		//in firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
		if( $('.hub-overlay-nav-left').hasClass('is-visible') ) {
			$('.hub-menu-icon').toggleClass('is-clicked'); 
			$('.hub-overlay-nav-left').removeClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
				$('body').removeClass('overflow-hidden');
			});
		} 
	}

	function closeSearchPanel() {	

		$('.hub-header').removeClass('search-is-open');
		$('#morphsearch').removeClass('menu-is-open');
	
        // trick to hide input text once the search overlay closes
        // todo: hardcoded times, should be done after transition ends
        if( morphSearchInput.value !== '' ) {
          setTimeout(function() {
            $('#morphsearch').addClass('hideInput');
            //classie.add( morphSearch, 'hideInput' );
            setTimeout(function() {
              //classie.remove( morphSearch, 'hideInput' );
              $('#morphsearch').removeClass('hideInput');
              morphSearchInput.value = '';
            }, 300 );
          }, 500);
        }

        morphSearchInput.blur();
	}

	function closeRightPanel() {	
		$('.hub-header').removeClass('rightnav-is-open');
		//close right panel
		//in firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
		if( $('.hub-overlay-nav-right').hasClass('is-visible') ) {
			$('.hub-overlay-nav-right-caret').removeClass('is-visible');
			$('.hub-overlay-nav-right').removeClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
				$('body').removeClass('overflow-hidden');
				
			});
		} 
	}




	//primary navigation slide-in effect
	if($(window).width() > MQL) {
		var headerHeight = $('.hub-header').height();
		$(window).on('scroll',
		{
	        previousTop: 0
	    }, 
	    function () {
		    var currentTop = $(window).scrollTop();
		    //check if user is scrolling up
		    if (currentTop < this.previousTop ) {
		    	//if scrolling up...
		    	if (currentTop > 0 && $('.hub-header').hasClass('is-fixed')) {
		    		$('.hub-header').addClass('is-visible');
		    	} else {
		    		$('.hub-header').removeClass('is-visible is-fixed');
		    	}
		    } else {
		    	//if scrolling down...
		    	$('.hub-header').removeClass('is-visible');
		    	if( currentTop > headerHeight && !$('.hub-header').hasClass('is-fixed')) $('.hub-header').addClass('is-fixed');
		    }
		    this.previousTop = currentTop;
		});
	}

	//close button
	$('.hub-overlay-close').on('click', function(){
		
		closeLeftPanel();
		closeRightPanel();

	});

	//open/close primary navigation
	$('.hub-overlay-nav-left-trigger').on('click', function(){
		if ($('.hub-header').hasClass('leftnav-is-open')){
			closeLeftPanel();
		} else {
			openLeftPanel();
		}
			
	});
/*
	$('input.morphsearch-input').on('click', function(){
		if ($('.hub-header').hasClass('search-is-open')){
			closeSearchPanel();
		} else {
			openSearchPanel();
		}
	});*/
	$('input.morphsearch-input').on('focus', function(){
		if ($('.hub-header').hasClass('search-is-open')){
		} else {
			openSearchPanel();
		}
	});

	$('span.morphsearch-close').on('click', function(){
		if ($('.hub-header').hasClass('search-is-open')){
			closeSearchPanel();
		} else {
			openSearchPanel();
		}

	});

	// esc key closes search overlay
	  // keyboard navigation events
	  document.addEventListener( 'keydown', function( ev ) {
	    var keyCode = ev.keyCode || ev.which;
	    if( keyCode === 27 && $('.hub-header').hasClass('search-is-open') ) {
	      closeSearchPanel();
	    }
	  } );

	//open/close primary navigation
	$('.hub-overlay-nav-right-trigger').on('click', function(){
		if ($('.hub-header').hasClass('rightnav-is-open')){
			closeRightPanel();
		} else {
			openRightPanel();
		}
	});

	


});