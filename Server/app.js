var express = require('express'),
driver = require('./routes/drivers');
 
var app = express();
 
/*
 * Konfiguracja expressa
 */
app.configure(function () {
app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
app.use(express.bodyParser());
});
 
/*
 * Tłumaczenie ścieżek
 */
app.get('/drivers', driver.findAll);
app.get('/drivers/:id', driver.findById);
app.post('/drivers', driver.addDriver);
app.put('/drivers/:id', driver.updateDriver);
//JShint nie chciał wspópracować z DELETE (reserved world)
app.del('/drivers/:id', driver.deleteDriver);


app.listen(3000);
console.log('Listening on port 3000...');