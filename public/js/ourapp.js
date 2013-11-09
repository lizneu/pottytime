$(document).ready(function(){
  var mapOptions = {
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map($('#mapCanvas')[0], mapOptions);


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

      map.setCenter(pos);

      var marker = new google.maps.Marker({
        position: map.getCenter(),
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 3,
          fillOpacity: 1,
          fillColor: "#00f",
          strokeColor: "#00f"
         },
        draggable: true,
        map: map
      });

    }, function() {
      console.log("geolocation fail :("); 
    });
  } else {
    // Browser doesn't support Geolocation
    console.log("your browser sucks, dude");
  }


});

$("#mapBtn").click(function(){
  $("#mapView").css("display","block");
  $("#listView").css("display","none");
  $("#mapBtn").toggleClass("active");
  $("#listBtn").toggleClass("active");
});

$("#listBtn").click(function(){
  $("#listView").css("display","block");
  $("#mapView").css("display","none");
  $("#mapBtn").toggleClass("active");
  $("#listBtn").toggleClass("active");
});