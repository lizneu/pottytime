P = {};

P.getPottiesSocket;
P.addPottySocket;

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

  potty.setId = function(d) {
    id = d;
  };
  potty.getLocation = function() {
    return location;
  };

  potty.getDist = function() {
    var R = 3959; // radius of earth in miles
    var dLat = (P.currPos.lat() - location.lat())*(Math.PI/180);
    var dLon = (P.currPos.lng() - location.lng())*(Math.PI/180);
    var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(location.lat()*(Math.PI/180)) * Math.cos(P.currPos.lat()*(Math.PI/180)) * 
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

  potty.isSingle = function() {
    return desc.isSingle;
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

P.loadDetailPage = function(){
  $("#description").text(P.currPotty.getDesc());
  $("#address").text(P.currPotty.getAddress());
  $("#distance").text(P.currPotty.getDist() + " miles away");
  $("#stars").text(P.currPotty.getRating() + " Stars");
  var revs = P.currPotty.getReviews();
  $("#numratings").text(revs.length + " Ratings");
  if(P.currPotty.isSingle())
    $("#accesibility").text("Single Stall");
  else
    $("#accesibility").text("Multiple Stalls");
  if(P.currPotty.isPublic())
    $("#accesibility").text("Public Use");
  else
    $("#accesibility").text("Customers only")  
  var i = 0;
  for(; i < revs.length ; i++){
     $("#listView").append($("<div id='reviewcontent'></div").text(revs[i].text));
  }

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

      P.currPos = pos;

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

      google.maps.event.addListener(P.map, 'bounds_changed', function() {
        P.loadPotties();
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

P.addPotty = function(newPotty) {
  if ($.inArray(newPotty, P.potties) == -1) {
    P.potties.push(newPotty);

    var marker = new google.maps.Marker({
      position: newPotty.getLocation(),
      draggable: false,
      map: P.map
    });
    P.markers.push(P.makePottyMarker(marker, newPotty)); 

    $("#listView").append($("<div class='entry'></div")
        .append($("<div class='rating'></div").text(newPotty.getRating()))
        .append($("<p class='address'></p>").text(newPotty.getAddress()))
        .append($("<p class='dist'></p>").text(newPotty.getDist().toFixed(2) + " mi")));
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
    P.updateList();
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
    P.markers[i].getMarker().setMap(null);
  }
  P.markers = [];
};

P.updateList = function() {
  $("#listView .entry").remove();

  var i=0;
  while(i < P.potties.length) {
    var potty = P.potties[i];
    $("#listView").append($("<div class='entry'></div")
        .append($("<div class='rating'></div").text(potty.getRating()))
        .append($("<p class='address'></p>").text(potty.getAddress()))
        .append($("<p class='dist'></p>").text(potty.getDist().toFixed(2) + " mi")));
    i++;
  } 
}


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

  $("#newPottyForm").submit(function(event){
    var lat = P.currPos.lat();
    var lng = P.currPos.lng();
    var rat  = parseInt($('.ratingBtn.active').text());
    var addr = $("#addressEntry").val();
    var review = [{rating: rat, text : $("#reviewcontent").val()}];
    var desc = {isPublic: $("#pubBtn").hasClass("active"), isSingle : $("#singleBtn").hasClass("active"), text: $("#descriptionEntry").val()};
    var potty = P.makePotty(0,P.currPos, addr, desc, rat, review);
    P.currPotty = potty;
    P.addPottySocket = io.connect("http://localhost/add");
    P.addPottySocket.emit("add", {lat: lat, long: lng, rating: rat,reviews: review, desc: desc});
    P.addPottySocket.on("success", function(data){
      P.currPotty.setId(data);
      P.loadDetailPage();
      P.addPotty(P.currPotty);
    });

    return false;
  });
  
  P.initMap();
});

