P = {};

P.map;

P.potties = [];
P.currPotty;

P.makePotty = function(id, location, address, desc, rating, reviews) {
  var potty = {};

  potty.getId = function() {
    return id;
  };

  potty.getLocation = function() {
    return location;
  };

  potty.getAddress = function() {
    return address;
  };

  potty.getDesc = function() {
    return desc;
  };

  potty.getRating = function() {
    return rating;
  };

  potty.getReviews = function() {
    return reviews;
  };

  potty.addReview = function(rev) {
    reviews.push(rev);
  };
}

P.initMap = function() {
  var mapOptions = {
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  P.map = new google.maps.Map($('#mapCanvas')[0], mapOptions);


  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

     /* var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'Location found using HTML5.'
      });*/

      P.map.setCenter(pos);

      var marker = new google.maps.Marker({
        position: P.map.getCenter(),
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 3,
          fillOpacity: 1,
          fillColor: "#00f",
          strokeColor: "#00f"
         },
        draggable: true,
        map: P.map
      });

    }, function() {
      console.log("geolocation fail :("); 
    });
  } else {
    // Browser doesn't support Geolocation
    console.log("your browser sucks, dude");
  }
};

P.loadPotties = function() {
  P.potties = [];
};


$(document).ready(function(){
  $(".toggleBtn").bind('click touchstart', function() {
    if (!$(this).hasClass("active")) {
      $(this).siblings(".toggleBtn").removeClass("active");
      $(this).addClass("active");
    }
  });

  $("#mapBtn").bind('click touchstart', function() {
    if (!$(this).hasClass('active')) {
      $("#mapView").show();
      $("#listView").hide();
      $("#mapBtn").addClass("active");
      $("#listBtn").removeClass("active");
    }
  });

  $("#listBtn").bind('click touchstart', function() {
    if (!$(this).hasClass('active')) {
      $("#mapView").hide();
      $("#listView").show();
      $("#mapBtn").removeClass("active");
      $("#listBtn").addClass("active");
    }
  });

    $("#pubBtn").on('click touchstart', function(){
    if (!$("#pubBtn").hasClass("active")) {
      $("#pubView").css("display","block");
      $("#priBtn").toggleClass("active");
      $("#pubBtn").toggleClass("active");
    }
  });
  
  P.initMap();

});

