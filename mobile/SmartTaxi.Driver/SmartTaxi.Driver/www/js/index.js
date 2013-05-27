$(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
});
var onDeviceReady = function () {
    ST.Ajax.getDrivers();
    ST.Geolocation.getPosition();
}
