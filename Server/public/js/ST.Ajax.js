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
        dataType: "json",
        statusCode: {
            201: function () {
                callBack();
            }
        },
        success: function (result) {
            callBack(result);
        },
        error: function (result) {}
    });
    return;
};
ST.Ajax.getDriverInfo = function (id) {
    $.getJSON("http://" + window.location.hostname + ":3000/api/drivers/" + id, function (json) {
        $('#details').text(json.name + " - " + json.bid + "zl/km");
        ST.Drivers.driverSelected.id = json._id;
    });    
};
ST.Ajax.calculateTime = function (coordsArray) {
    var stringus = "";
    var seperator = "";
    $.each(coordsArray, function (i, value) {
        stringus = stringus + seperator + coordsArray[i].latitude + "," + coordsArray[i].longitude;
        seperator = "|";
    });
    var latitude = ST.Geolocation.latitude;
    var longitude = ST.Geolocation.longitude;
    ST.Drivers.Time = [];
    $.getJSON("http://maps.googleapis.com/maps/api/distancematrix/json?origins=" + stringus + "&destinations=" + latitude + "," + longitude + "&language=pl-PL&sensor=false", function (json) {
        $.each(coordsArray, function (i, value) {
            $(".list" + i + " .driverTimeEstimate").append(json.rows[i].elements[0].duration.text);
            ST.Drivers.Time.push(json.rows[i].elements[0].duration.text);
        });
    });
};