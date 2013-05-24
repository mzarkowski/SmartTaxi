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
 * T³umaczenie œcie¿ek
 */
app.get('/drivers', driver.findAll);
app.get('/drivers/:id', driver.findById);
app.post('/drivers', driver.addWine);
app.put('/drivers/:id', driver.updateWine);
//JShint nie chcia³ wspó³pracowaæ z DELETE (reserved world)
app.del('/drivers/:id', driver.deleteWine);


app.listen(3000);
console.log('Listening on port 3000...');