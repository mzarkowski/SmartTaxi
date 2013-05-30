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
        var coordsArray = [];
        $.each(data, function (i, value) {
            $('#availableDrivers').append('<div class="driversItem list' + i + ' driversItembackground" onclick="chooseDriver(this)"><div class="photo"><img src="img/person.png" alt="Taxi" /></div><div class="driverName"></div><div class="driverCar"></div><div class="driverBid"></div><div class="driverTimeEstimate"></div><div class="historyUrl"></div></div>');
            $('.list' + i + ' .driverName').append('' + data[i].name + '');
            $('.list' + i + ' .driverCar').append('' + data[i].brand + ', ' + data[i].year + '');
            $('.list' + i + ' .driverBid').append(' Stawka: ' + data[i].bid + ' zł');
            $('.list' + i + ' .driverTimeEstimate').append('Czas oczekiwania : ');
            coordsArray.push({ latitude: data[i].coords.latitude, longitude: data[i].coords.longitude });
        });
        chooseDriver('.list0');
        //ST.Ajax.calculateTime(coordsArray);
    });
};

ST.Ajax.calculateTime = function (coordsArray) {
    var stringus = "";
    var seperator = "";
    $.each(coordsArray, function(i, value) {
        stringus = stringus + seperator + coordsArray[i].latitude + ',' + coordsArray[i].longitude;
        seperator = "|";
    });
    var latitude = '54.395901';
    var longitude = '18.578725';
    $.getJSON("http://maps.googleapis.com/maps/api/distancematrix/json?origins=" + stringus + "&destinations=" + latitude + "," + longitude + "&language=pl-PL&sensor=false", function (json) {
        //console.log("JSON Data: " + json.users[3].name);
        $.each(coordsArray, function (i, value) {
            $('.list' + i + ' .driverTimeEstimate').append(json.rows[i].elements[0].duration.text);
        });
    });
};

function chooseDriver(elem) {
    $(elem).siblings().removeClass('driversItembackgroundSelected').addClass('driversItembackground');
    $(elem).removeClass('driversItembackground');
    $(elem).addClass('driversItembackgroundSelected');
}