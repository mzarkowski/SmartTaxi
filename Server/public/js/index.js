$(function() {
  ST.Socket.socket = io.connect(window.location.hostname);
  ST.Map = ST.Map || {};
  
  ST.Socket.socket.on('connect', function (data) {
      ST.Socket.socket.emit('storeClientInfo', { customId: ST.Socket.userID, type: "client" });
  });
  
  ST.Map.Marker = function(id, marker) {
    this.id = id;
    this.marker = marker;
  };
  ST.Map.Image = "./img/taxi-busy.png";
  var markers = [];
  var map = null;
  
  var initialize = function() {
    var mapDiv = document.getElementById("map-canvas");
    var latLng = new google.maps.LatLng(54.380757, 18.601856);
    map = new google.maps.Map(mapDiv, {center:latLng, zoom:13, mapTypeId:google.maps.MapTypeId.ROADMAP});
    infoWindow = new google.maps.InfoWindow();
  };
  initialize();
  var addMarkers = function(latLng) {
    return new google.maps.Marker({position:latLng, map:map, icon:ST.Map.Image});
  };
  ST.Socket.socket.on("updateCoords", function(data) {
       //isFree to isBusy dlatego false
       if(data.isFree == "false"){
          ST.Map.Image = "./img/taxi-free.png";
       }
    else{
          ST.Map.Image = "./img/taxi-busy.png"; 
       }
    for(var i = 0, len = markers.length;i < len;++i) {
      var d = markers[i];
      if(d.id == data.id) {
        d.marker.setMap(null);
        markers.splice(i, 1);
        break;
      }
    }

    var taxi = new ST.Map.Marker(data.id, addMarkers(new google.maps.LatLng(data.latitude, data.longitude)));

    markers.push(taxi);
    google.maps.event.addListener(taxi.marker, "click", function(event) {
      $('#getTaxi').toggle();
      ST.Ajax.getDriverInfo(data.id);
    });
  });
});