var express = require('express'),
wines = require('./routes/drivers');
var app = express();

app.get('/drivers', drivers.findAll);
app.get('/drivers/:id', drivers.findById);

app.listen(3000);
console.log('Listening on port 3000...');