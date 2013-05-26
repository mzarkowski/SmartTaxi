var express = require('express'),
path = require('path'),
driver = require('./routes/drivers'),
io = require('socket.io'),
http = require('http');
 
var app = express();

app.configure(function () {
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
});
 
var server = http.createServer(app);
io = io.listen(server);
 
server.listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
	});

/*
 * Tłumaczenie ścieżek
 */
app.get('/api/drivers', driver.findAll);
app.get('/api/drivers/available', driver.findAvailableAndFree);
app.get('/api/drivers/:id', driver.findById);
app.post('/api/drivers', driver.addDriver);
app.put('/api/drivers/:id', driver.updateDriver);
//JShint nie chce wspópracować z DELETE (reserved world)
app.del('/api/drivers/:id', driver.deleteDriver);


io.sockets.on('connection', function (socket) {
	 
	socket.on('message', function (message) {
	console.log("Got a message: " + message);
	ip = socket.handshake.address.address;
	url = message;
	io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length, 'ip': '***.***.***.' + ip.substring(ip.lastIndexOf('.') + 1), 'url': url, 'xdomain': socket.handshake.xdomain, 'timestamp': new Date()});
	});
	 
	socket.on('disconnect', function () {
	console.log("Socket disconnected");
	io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length});
	});
	 
	});