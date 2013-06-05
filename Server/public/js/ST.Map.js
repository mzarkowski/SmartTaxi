var initializeMap = function (address) {
Geocoder = new google.maps.Geocoder();
    Geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            ST.Geolocation.latitude = results[0].geometry.location.lat();
            ST.Geolocation.longitude = results[0].geometry.location.lng();
            ST.Ajax.getDrivers();
            $('#gps').text("U¿ywasz rêcznego adresu. Kliknij, aby u¿yæ GPS");
            mapFunction(results[0].geometry.location);
        } else {
            
        }
    });

    var mapFunction = function (coords) {
        var mapOptions = {
            scaleControl: true,
            center: coords,
            zoom: 18,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

        var marker = new google.maps.Marker({
            map: map,
            position: map.getCenter()
        });
        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent(address);
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });
    };
    
};