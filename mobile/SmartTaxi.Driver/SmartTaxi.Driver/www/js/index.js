$(function () {
    document.addEventListener("deviceready", function () {
        ST.Drivers.driverId = '51ab6cc4802dcd306c000001';
        ST.Socket.socket = io.connect("http://localhost:3000");
    }, false);


    var opts = {
        lines: 13, // The number of lines to draw
        length: 4, // The length of each line
        width: 6, // The line thickness
        radius: 15, // The radius of the inner circle
        corners: 0.4, // Corner roundness (0..1)
        rotate: 37, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb
        speed: 1.2, // Rounds per second
        trail: 46, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 1, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };
    var target = document.getElementById('LoadingSpinner');
    //var target2 = document.getElementById('LoadingTaxi');
    var spinner = new Spinner(opts).spin(target);
    //var spinner2 = new Spinner(opts).spin(target2);
});