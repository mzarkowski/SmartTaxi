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
var clients =[];
io.sockets.on('connection', function(socket){
	
    socket.on('storeClientInfo', function (data) {
        var clientInfo = {};
        console.log("Zalogował się użytkownik :" + JSON.stringify(data));
        clientInfo.customId = data.customId;
        clientInfo.clientId = socket.id;
        clientInfo.type = socket.type;
        clients.push(clientInfo);
    });
    
    
	socket.on('driverLoggedIn', function(data){
		//zmieniamy status na dostępny
		console.log(data);
	});
	
	socket.on('getCourse', function(data){
		console.log("Wysłano żądanie o kurs");
		var driver = null;
		//uzyskanie socketa kierowcy
		var len=clients.length;
		for( var i=0; i<len; ++i ){
			var c = clients[i];
			if(c.customId == data.driver){
				driver = c.clientId;
				break;
			}
		}
		io.sockets.socket(driver).emit('newCourse', {'from' : data.client, 'where' : data.coords});
		//io.sockets.emit('course', {'client': data.});
	});
	
	socket.on('courseResponse', function(data){
		var client = null;
		//uzyskanie socketa klienta
		var len=clients.length;
		for( var i=0; i<len; ++i ){
			var c = clients[i];
			if(c.customId == data.to){
				client = c.clientId;
				break;
			}
		}
		console.log("Dostano odpowiedź od kierowcy");
		if(data.response === 1){
			driver.updateDriverStatus(data);
		}
		io.sockets.socket(client).emit('courseResponseToClient', {'from' : client, 'response' : data.response});
	});
	
	socket.on('updateDriverCoords', function(data){
		driver.updateDriverCoords(data);
	});
	
  setInterval(function(){
    io.sockets.emit('date', {'date': new Date()});
  }, 10000);


  socket.on('disconnect', function (data) {
console.log("Dyskonekcja");
      for( var i=0, len=clients.length; i<len; ++i ){
          var c = clients[i];

          if(c.clientId == socket.id){
              clients.splice(i,1);
              break;
          }
      }

  });
});