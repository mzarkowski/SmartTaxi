var express = require('express');
 
var app = express();

app.get('/drivers', function(req, res) {
	res.send([{name:'driver1'}, {name:'driver2'}]);
	});
app.get('/', function(req, res) {
	res.send([{name:'driver1'}, {name:'driver2'}]);
	});
app.listen(3000);
console.log('Listening on port 3000...');