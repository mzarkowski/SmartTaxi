var ST = ST || {};

ST.Navigation = ST.Navigation || {};
ST.Navigation.from = "";
ST.Navigation.isBusy = "false";
ST.Navigation.driverId = "";
ST.Navigation.newCourse = function(data) {
    $('.page').removeClass('hidden');
    $('#time').text('Szac. czas dojazdu: ' + data.time);
    $('#tel').text('Numer telefonu: ' + data.tel);
    $('#time1').text($('#time').text());
    $('#tel1').text($('#tel').text());
    $('#clientAdress').text(data.destination);
    ST.Navigation.from = data.client;
    ST.Navigation.driverId = data.driver;
    ST.Navigation.destination = data.destination;
};
ST.Navigation.step2 = function (response) {
    
    if (response === 1) {
        ST.Socket.socket.emit('courseResponse', { response: 1, to: ST.Navigation.from, driverId: ST.Navigation.driverId });
        $('#step1').addClass("hidden");
        $('#step2').removeClass("hidden");
        initializeMap(ST.Navigation.destination);
        ST.Navigation.isBusy = "true";
    }
    else {
        //Kierowca się nie zgadza
        ST.Socket.socket.emit('courseResponse', { response: 0, to: ST.Navigation.from, driverId: ST.Navigation.driverId });
        $('.page').addClass('hidden');
        ST.Navigation.isBusy = "false";
    }
    
};

ST.Navigation.courseEnded = function() {
    $('.page').addClass('hidden');
    ST.Socket.socket.emit('courseEnded', { to: ST.Navigation.from, driverId: ST.Navigation.driverId });
    ST.Navigation.isBusy = "true";
};

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


ST.Navigation.chooseDriver = function (elem,i) {
    $('#appBar').addClass('appBarHidden');
    $(elem).siblings().removeClass('driversItembackgroundSelected').addClass('driversItembackground');
    $(elem).removeClass('driversItembackground');
    $(elem).addClass('driversItembackgroundSelected');
    ST.Drivers.driverSelected = ST.Drivers.Array[i];
    $('#details').text(ST.Drivers.driverSelected.name + ' - ' + ST.Drivers.driverSelected.bid + 'zł/km');
};



ST.Navigation.login = function() {
    var parm = {
        "name": $('#loginInput').val(),
        "password": md5($('#passwordInput').val())
    };
    ST.Ajax.getDrivers(parm);
};