jQuery.support.cors = true;
var ST = ST || {};

ST.Ajax = ST.Ajax || {};
ST.Ajax.send = function (url, method, parm, callBack) {
    $.ajax({
        type: method,
        url: "http://localhost:3000/api/drivers/available",
        data: JSON.stringify(parm),
        crossDomain: true,
        contentType: "application/json;charset=utf-8",
        dataType: 'json',
        statusCode: {
            201: function () {
                callBack();
            },
            401: function () {
                //alert(K.Language.translateWord[lang][14]);
            },
            403: function () {
                //alert(K.Language.translateWord[lang][15]);
            },
            404: function () {
                //alert(K.Language.translateWord[lang][16]);
            },
            500: function () {
                $('#PostNotification').removeClass('hidden');
                $('#reportInProgress').addClass('hidden');
                //alert(K.Language.translateWord[lang][17]);
            },
            502: function () {
                //alert(K.Language.translateWord[lang][18]);
            },
            503: function () {
                //alert(K.Language.translateWord[lang][19]);
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
    return ST.Ajax.send("drivers/available", "GET", '', function (data) {
        $.each(data, function (i, value) {
            $('#availableDrivers').append('<div class="driversItem list' + i + '"><div class="driverName"></div><div class="driverCar"></div><div class="driverBid"></div><div class="driverTimeEstimate"></div><div class="historyUrl"></div></div>');
            $('.list' + i + ' .driverName').append('<p>' + data[i].name + '</p>');
            $('.list' + i + ' .driverCar').append('<p>' + data[i].brand + ', ' + data[i].year + 'rok</p>');
            $('.list' + i + ' .driverBid').append('<p> Stawka: ' + data[i].bid + '</p>');
            $('.list' + i + ' .driverTimeEstimate').append('<p> Szacowany czas przyjazdu : ' + data[i].bid + '</p>');
            
        });
    });
};