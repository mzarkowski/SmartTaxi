jQuery.support.cors = true;
var ST = ST || {};

ST.Ajax = ST.Ajax || {};
ST.Ajax.send = function (url, method, parm, callBack) {
    $.ajax({
        type: method,
        url: url,
        data: JSON.stringify(parm),
        crossDomain: true,
        contentType: "application/json;charset=utf-8",
        dataType: 'json',
        statusCode: {
            201: function () {
                callBack();
            }
        },
        success: function (result) {
            callBack(result);
        },
        error: function (result) {

        }
    });
    return;
};

ST.Ajax.getDrivers = function () {
    return ST.Ajax.send("http://localhost:3000/api/drivers/available", "GET", '', function (data) {
        $.each(data, function (i, value) {
            $('#availableDrivers').append('<div class="driversItem list' + i + ' driversItembackground" onclick="chooseDriver(this)"><div class="photo"><img src="img/person.png" alt="Taxi" /></div><div class="driverName"></div><div class="driverCar"></div><div class="driverBid"></div><div class="driverTimeEstimate"></div><div class="historyUrl"></div></div>');
            $('.list' + i + ' .driverName').append('' + data[i].name + '');
            $('.list' + i + ' .driverCar').append('' + data[i].brand + ', ' + data[i].year + '');
            $('.list' + i + ' .driverBid').append(' Stawka: ' + data[i].bid + ' zł');
            $('.list' + i + ' .driverTimeEstimate').append('Obliczam czas...');
            
        });
    });
};

ST.Ajax.calculateTime = function () {
	    return ST.Ajax.send("http://maps.googleapis.com/maps/api/distancematrix/json?origins=Vancouver+BC|Seattle&destinations=San+Francisco|Victoria+BC&mode=bicycling&language=fr-FR&sensor=false", "GET", '', function (data) {
	        ST.Drivers.coordsArray.removeAll();
	        $.each(data, function (i, value) {
            $('#availableDrivers').append('<div class="driversItem list' + i + ' driversItembackground" onclick="chooseDriver(this)"><div class="photo"><img src="img/person.png" alt="Taxi" /></div><div class="driverName"></div><div class="driverCar"></div><div class="driverBid"></div><div class="driverTimeEstimate"></div><div class="historyUrl"></div></div>');
            $('.list' + i + ' .driverName').append('' + data[i].name + '');
            $('.list' + i + ' .driverCar').append('' + data[i].brand + ', ' + data[i].year + '');
            $('.list' + i + ' .driverBid').append(' Stawka: ' + data[i].bid + ' zł');
            $('.list' + i + ' .driverTimeEstimate').append('Obliczam czas...');
            ST.Drivers.coordsArray.push({ latitude: data[i].coords.latitude, longitude: data[i].coords.longitude });
	        });
	        alert(ST.Drivers.coordsArray);
    });
};

function chooseDriver(elem) {
	$(elem).siblings().removeClass('driversItembackgroundSelected').addClass('driversItembackground');
    $(elem).removeClass('driversItembackground');
	$(elem).addClass('driversItembackgroundSelected');
}