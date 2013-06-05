var initializeMap = function (address) {
Geocoder = new google.maps.Geocoder();
    Geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            mapFunction(results[0].geometry.location);
        } else {
            
        }
    });

    var mapFunction = function (coords) {
        var mapOptions = {
            scaleControl: true,
            center: coords,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    };
    
};