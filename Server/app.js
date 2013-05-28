var express = require('express'),
path = require('path'),
driver = require('./routes/drivers'),
io = require('socket.io'),
http = require('http');
 
var app = express();

/* CORS */
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if ('OPTIONS' == req.method) {
	res.send(200);
	}
	else {
	next();
	}
};
	
app.configure(function () {
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(allowCrossDomain);
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


io.set('log level', 1);

io.sockets.on('connection', function(socket){
	
	socket.on('driverLoggedIn', function(data){
		//zmieniamy status na dostępny
		console.log(data);
	});
	
	socket.on('updateDriverCoords', function(data){
		console.log(data);
	});
	
  setInterval(function(){
    io.sockets.emit('date', {'date': new Date()});
  }, 10000);
});