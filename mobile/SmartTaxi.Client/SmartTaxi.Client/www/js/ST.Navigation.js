var ST = ST || {};

ST.Navigation = ST.Navigation || {};

ST.Navigation.ClosePage = function (elem) {
    $(elem).parent().parent().parent().addClass('hidden');
};

ST.Navigation.showPage = function (page) {
    $('.page').addClass('hidden');
    $('#' + page).removeClass('hidden');
};

ST.Navigation.getMap = function () {
    ST.Geolocation.stopTracking();
    var value = $('#address').val();
    if (value == "") {
        alert("Pole nie może być puste");
    } else {
        $('#map-canvas').removeClass('hidden');
        initializeMap(value);
    }
};

ST.Navigation.gpsAccurate = function () {
    ST.Ajax.getDrivers();
    $('#gps').text("Twoja pozycja GPS jest dokładna");
    $('#gettingGps').addClass('hidden');
};

ST.Navigation.useGPS = function () {
    $('#appBar').addClass('hidden');
    ST.Geolocation.stopTracking();
    $('.driversItem').remove();
    $('#positionUnavailable').removeClass('hidden');
    $('#map-canvas').addClass('hidden');
    $('#gps').text("Trwa pobieranie pozycji z GPS...");
    $('#gettingGps').removeClass('hidden');
    ST.Geolocation.getPosition();
};

$('#appBar').on('mouseover', function () { $('#appBar').removeClass('appBarHidden'); });
$('#appBar').on('mouseout', function() {
    $('#appBar').addClass('appBarHidden');
    appBarSelected = false;
});


ST.Navigation.chooseDriver = function(elem) {
    $('#appBar').addClass('appBarHidden');
    $(elem).siblings().removeClass('driversItembackgroundSelected').addClass('driversItembackground');
    $(elem).removeClass('driversItembackground');
    $(elem).addClass('driversItembackgroundSelected');
};

ST.Navigation.confirmAdress = function () {
    $('#order').addClass('hidden');
    $('#getTaxi').children('#invisible').addClass('hidden');
    $('#step2').removeClass('hidden');
};

