$(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
});
var onDeviceReady = function() {
    ST.Ajax.getDrivers();
    ST.Geolocation.getPosition();
	ST.Socket.socket = io.connect("http://localhost:3000");
};
