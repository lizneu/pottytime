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
    }, function() {
      console.log("geolocation fail :("); 
    });
  } else {
    // Browser doesn't support Geolocation
    console.log("your browser sucks, dude");
  }
});