$(function () {
        ST.Socket.socket = io.connect("http://localhost:3000");
		ST.Map = ST.Map || {};
		ST.Map.Marker = function (id, marker) {
			this.id = id;
			this.marker = marker;
		};
	
	var markers = [];
	var map = null;
	initialize();
	
function initialize() {
	var mapDiv = document.getElementById('map-canvas');
	var latLng = new google.maps.LatLng(54.380757, 18.601856);
	map = new google.maps.Map(mapDiv, {
		center: latLng,
		zoom: 13,
		mapTypeId: google.maps.MapTypeId.ROADMAP
  })
  infoWindow = new google.maps.InfoWindow();
  ;

  var myLatLng = new google.maps.LatLng(-33.890542, 151.274856);
	//addMarkers(latLng, map, image);
}
var addMarkers = function(latLng) {
	var image = './img/taxi-busy.png';
	return new google.maps.Marker({
    position: latLng,
    map: map,
    icon: image,
	labelContent: "dupa"
	
  });
}

ST.Socket.socket.on('updateCoords', function(data){
	  for( var i=0, len=markers.length; i<len; ++i ){
          var d = markers[i];

          if(d.id == data.driverId){
			  d.marker.setMap(null);
              markers.splice(i,1);
              break;
          }
      }
	  var taxi = new ST.Map.Marker(data.driverId, addMarkers(new google.maps.LatLng(data.latitude, data.longitude)));
	markers.push(taxi);
	google.maps.event.addListener(taxi.marker, "click", function (event) {
                    alert("dupa");
	});
	
	
	
});
	
});