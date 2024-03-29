﻿var ST = ST || {};
ST.Geolocation = ST.Geolocation || {};
ST.Geolocation.minAccuracy = 160.0;
ST.Geolocation.accuracy = ST.Geolocation.minNetworkAccuracy + 1;

ST.Geolocation.getPosition = function () {
    var options = {};
    options.enableHighAccuracy = true;
    options.frequency = 1000;
    options.timeout = 10000;
    ST.Geolocation.watchID = navigator.geolocation.watchPosition(ST.Geolocation.onSuccess, ST.Geolocation.onError, options);
};

ST.Geolocation.onSuccess = function (position) {

    if (position.coords.accuracy >= ST.Geolocation.minAccuracy) {
        //udało się uzyskać dostęp do GPS ale pozycja jest niedokładna
    } else {
        //aktualizacja pozycji
        ST.Geolocation.latitude = position.coords.latitude;
        ST.Geolocation.minAccuracy = ST.Geolocation.accuracy;
        $('#positionUnavailable').addClass('hidden');
        $('#message').text("Twoja pozycja jest przekazywana. Czekaj na klientów.");
        ST.Socket.socket.emit('updateDriverCoords', { driverId: ST.Drivers.driverId, longitude: position.coords.longitude, latitude: position.coords.latitude, isFree: ST.Navigation.isBusy});
    }
};

ST.Geolocation.onError = function (error) {
    var message;
    // Obsługa błędów
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Włącz obsługę GPS w telefonie");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Problem z GPS");
            break;
        case error.TIMEOUT:
            ST.Geolocation.stopTracking();
            break;
    }
};

ST.Geolocation.stopTracking = function () {
    navigator.geolocation.clearWatch(ST.Geolocation.watchID);
};