var myApp = angular.module('myApp', []);
myApp.directive('whenVisible', function() {
    
    function isScrolledIntoView(elem)
    {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + ($(window).outerHeight());
        var elemTop = elem.offset().top;
        var elemBottom = elemTop + elem.innerHeight();
        
        return (elemTop <= docViewBottom) && (elemTop > docViewTop) || (elem.hasClass("active"));
    }
    
    return function(scope, elm, attr) {
        var raw = elm[0];
        $(window).scroll(function(){
            if (isScrolledIntoView(elm)) {
                elm.addClass("animated");
                
                if (!scope.busy){
                    setTimeout(function(){
                        scope.$apply(attr.whenVisible);
                    },500);
                }
            }
            else {
                elm.removeClass("animated");
            }
            return false;
        });
    };
});
myApp.filter('random', function(len){
    return function(num){
        return num * Math.floor((Math.random() * len) + 1)
    };
});
myApp.controller('mainCtrl', function Main($scope, $http){
  
    $scope.itemsPerPage = 20;     //infinite scroll page size - items in each page before showing via inifinite scroll
    $scope.itemsFromServer = 80;  //server page size - how many to get when reload from server
    $scope.colors = ["pink","blue","lime","orange","cyan","purple","amber","indigo","green"];
  
    $scope.getData = function(startAt,count){
         $scope.items = $scope.items||[];
         
         $scope.items = [
            {
                url: "https://dnrweb.state.co.us/cdss",
                title: "Colorado Decision Support System - Data & Tools",
                desc: "The Colorado Decision Support System helps DWR administer and manage water across the State of Colorado.",
                imgThumb: "#",
				tags: ["ASP.NET MVC 5","CSS","JavaScript","jQuery","T-SQL"]
            }
        ];

         $scope.lastIndex = $scope.items.length;
         $scope.loading = false;
    };
  
    /* get more from server */
    $scope.loadMore = function(startAt,count){
        $scope.loading = true;
        $scope.getData(startAt,count);
        $scope.needToLoadMore = false;
    };
    
    /* show more of currently loaded data */
    $scope.showMore = function(howMany){
       
        if (!$scope.busy){
            $scope.pageIndex = $scope.pageIndex + howMany;
            $scope.currentPage = Math.floor($scope.pageIndex / $scope.itemsPerPage);
            
            setTimeout(function(){
                $scope.busy = false;
                if ($scope.pageIndex >= $scope.lastIndex){
                    $scope.needToLoadMore = true;
                }
                else {
                    $scope.needToLoadMore = false;
                }
            },300);
            $scope.busy = true;
        }
        
    };
 
    // init!
    $scope.busy = false;
    $scope.needToLoadMore = false;
    $scope.getData(0,$scope.itemsFromServer);
    $scope.currentPage = 1;
    $scope.pageIndex = 24;       //items to show initially
 
});

$(document).ready(function(){

    $('.modal-trigger').modal();

    var lastScrollTop = 0;
    var selector = ".page";
    $(window).scroll(function() {
    
        var curr = $('.active:not(".wait")');
        var next, prev;
        
        if (curr.length !== 0) {
            next = curr.next();
            prev = curr.prev();
        }
        
        var st = $(this).scrollTop();
        if (st > lastScrollTop){
            
            // downscroll code
            if (typeof next!="undefined" && atBottom(curr[0])) {
                changeActivePageDown(curr,next);
            }
            else {
                // last page
                curr.removeClass("fixed");
            }
            
        }
        else {
            
            // upscroll code
            if (curr.index()===0){
                // already at top of first page
                return;
            }
            
            if (typeof curr != "undefined" && typeof prev != "undefined") {

                if (atTop(curr[0])) {
                     changeActivePageUp(curr,prev,next);
                }
                
            }
            else {
             
                var last = $(selector).last();
                if (atTop(last[0])) {
                    // make last page fixed
                    last.prev().addClass("wait").addClass("active");
                    last.removeClass("prev").addClass("fixed");
                    last.prev().removeClass("prev").removeClass("wait");
                }
                else {
                    // make last page active
                    last.addClass("active");
                }
            }
        }
    
        // arrows
        if ($('.active').length===0) {
            $('.arrows').addClass("hide");
        } else {
            $('.arrows').removeClass("hide");
        }
    
        lastScrollTop = st;
        return;
    });
    
    $('.downArrow').click(function(){
        var curr = $('.active');
        var next, prev;
        if (curr.length !== 0) {
            next = curr.next(selector);
            if (next.length !== 0) {
                var scrolly = next.position().top + curr.position().top + curr.outerHeight();
                
                if (next.css('position')=="relative") {
                    // mobile
                    scrolly = next.offset().top + 1;
                }
                
                $('html,body').animate({ 
                    scrollTop: scrolly
                }, 700);
            }
            else {
                //end of pages
                $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
            }
        }
        return false;
    });
    
    $('.upArrow').click(function(){
        $('html,body').animate({ scrollTop: 0 },500);
        return false;
    });
    
});

function changeActivePageDown(curr,next) {
    curr.removeClass("active").addClass("prev");
    if (next) {
        next.addClass("active").addClass("wait").removeClass("fixed");
        next.next().addClass("fixed");
        next.removeClass("wait");
    }
}

function changeActivePageUp(curr,prev,next) {
    prev.addClass("active").addClass("wait").removeClass("prev");
    next.removeClass("fixed");
    curr.removeClass("active").addClass("fixed");
    prev.removeClass("wait");
}

function atBottom(ele) {
    if (ele.getBoundingClientRect().bottom <= 1) {
        return true;
    }
    return false;
}

function atTop(ele) {
    if (ele.getBoundingClientRect().top >= 0) {
        return true;
    }
    return false;
}