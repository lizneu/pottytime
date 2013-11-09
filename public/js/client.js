P = {};

P.getPottiesSocket;

P.map;
P.currPos;
P.markers = [];

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

  potty.getDist = function() {
    var R = 3959; // radius of earth in miles
    var dLat = (P.currPos.lat() - location.lat())*(Math.PI/180);
    var dLon = (P.currPos.lon() - location.lon())*(Math.PI/180);
    var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in miles 
  };

  potty.getAddress = function() {
    return address;
  };

  potty.getDesc = function() {
    return desc.text;
  };

  potty.isPublic = function() {
    return desc.isPublic;
  };

  potty.singleStall = function() {
    return desc.singleStall;
  };

  potty.getRating = function() {
    return rating;
  };

  potty.setRating = function(newRating) {
    rating = newRating;
  };

  potty.getReviews = function() {
    return reviews;
  };

  potty.addReview = function(rev) {
    reviews.push(rev);
  };

  return potty;
};

P.makePottyMarker = function(marker, potty) {
  var pottyMarker = {};

  pottyMarker.getMarker = function() {
    return marker;
  };

  pottyMarker.setMarker = function(m) {
    marker = m;
  };

  pottyMarker.getPotty = function() {
    return potty;
  };

  pottyMarker.setPotty = function(p) {
    potty = p;
  };

  return pottyMarker;

};

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

      P.currPos = pos;

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

      P.loadPotties(); 

    }, function() {
      console.log("geolocation fail :("); 
    });
  } else {
    // Browser doesn't support Geolocation
    console.log("your browser sucks, dude");
  }
};

P.loadPotties = function() {

  var bounds = P.map.getBounds();
  var NE = bounds.getNorthEast();
  var SW = bounds.getSouthWest();

  P.getPottiesSocket = io.connect("http://localhost/nearest");
  P.getPottiesSocket.emit("nearest", {ne_lat: NE.lat(), ne_long: NE.lng(), sw_lat: SW.lat(), sw_long: SW.lng()});
  P.getPottiesSocket.on("nearby", function(data) {
    console.log(data);
    P.potties = [];
    P.currPotty = null;
    for (var i=0; i<data.length; i++) {
      var curr = data[i];
      var potty = P.makePotty(curr.id, new google.maps.LatLng(curr.lat, curr.long), 
          curr.address, curr.desc, curr.rating, curr.reviews);
      P.potties.push(potty);
    }
    P.updateMarkers();
  });
};

P.updateMarkers = function() {
  P.removeAllMarkers();
  for (var i=0; i<P.potties.length; i++) {
    var potty = P.potties[i];
    var marker = new google.maps.Marker({
      position: potty.getLocation(),
      draggable: false,
      map: P.map
    });
    P.markers.push(P.makePottyMarker(marker, potty));
  }
};

P.removeAllMarkers = function() {
  for (var i=0; i<P.markers.length; i++) {
    P.markers[i].marker.setMap(null);
  }
  P.markers = [];
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

