var ST = ST || {};

ST.Navigation = ST.Navigation || {};

ST.Navigation.ClosePage = function (elem) {
	$('#getTaxi').toggle();
};

ST.Navigation.showPage = function (page) {
    $('.page').addClass('hidden');
    $('#' + page).removeClass('hidden');
};

ST.Navigation.getMap = function () {
    ST.Geolocation.stopTracking();
    var value = $('#address').val();
    if (value === "") {
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
$('#appBar').on('mouseout', function () {
    $('#appBar').addClass('appBarHidden');
    appBarSelected = false;
});


ST.Navigation.clearOrder = function() {
    $('#order').removeClass('hidden');
    $('#getTaxi').children('#invisible').removeClass('hidden');
    $('#step2').addClass('hidden');
    $('#appBar').removeClass('hidden');
    $('#getTaxi').addClass('hidden');
};

ST.Navigation.CourseResponse = function(response) {
    if(response === 0) {
        alert("Kierowca nie przyjedzie");
        ST.Navigation.clearOrder();
    }
    else {
        $('#step2').addClass('hidden');
        ST.Navigation.clearOrder();
        alert("Taksówkarz wysłany");
    }

};

ST.Navigation.courseEnded = function (response) {
        alert("Kurs skończony");
        ST.Navigation.clearOrder();
};

ST.Navigation.confirmAdress = function () {
    var kolbak = function (button) {
        if (button === 0) {
            $('#order').addClass('hidden');
            $('#getTaxi').children('#invisible').addClass('hidden');
            $('#step2').removeClass('hidden');
            $('#appBar').addClass('hidden');
            ST.Socket.socket.emit('getCourse', { 'client': ST.Socket.userID, 'driver': ST.Drivers.driverSelected.id, tel: $('#phone').val(), destination: $('#destination').val(), time: "Niedostępny"});
            var seconds = 30;
            var secondsWord = "sekund";
            
            var timeRemaining = window.setInterval(function () {

                if (seconds === 3) secondsWord = "sekundy";
                if (seconds === 1) secondsWord = "sekunda";
                $('#timer').text(seconds-- + " " + secondsWord);

                if (seconds === 0) {
                    ST.Socket.socket.emit('courseCanceled', { driverId: ST.Drivers.driverSelected.id });
                    window.clearInterval(timeRemaining);
                    alert('Kierowca nie odpowiada');
                    ST.Navigation.clearOrder();
                }
            }, 1000);

            ST.Socket.socket.on('courseResponseToClient', function (data) {
                window.clearInterval(timeRemaining);
                ST.Navigation.CourseResponse(data.response);
            });
            
            return true;
        }
    };
    var k = confirm("Czy na pewno chcesz zamówić taxi?", kolbak, "Potwierdzić?", "Tak,Nie");
    if (k) {
        kolbak(0);
    }
};