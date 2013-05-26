var mongo = require('mongodb');
 
var Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure;
 
/*
 * Ustawienia serwera mongo
 */
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('smartTaxi', server);
 

db.open(function(err, db) {
	if(!err) {
		console.log("Połączono z bazą");
		db.collection('drivers', {strict:true}, function(err, collection) {
			if (err) {
				//Na potrzeby testów aplikacji
				console.log("Brak kierowców w bazie. Uzupełniamy danymi.");
				insertDB();
			}
		});
	}
});

exports.findById = function(req, res) {
	var id = req.params.id;
	console.log('Driver: ' + id);
	db.collection('drivers', function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);
		});
	});
};
 
exports.findAll = function(req, res) {
	db.collection('drivers', function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
		});
	});
};

exports.findAvailableAndFree = function(req, res) {
	db.collection('drivers', function(err, collection) {
		collection.find({isFree: "false", isActive: "true"}).toArray(function(err, items) {
			res.send(items);
		});
	});
	};	
 
exports.addDriver = function(req, res) {
	var driver = req.body;
	console.log('Dodawanie kierowcy: ' + JSON.stringify(wine));
	db.collection('drivers', function(err, collection) {
		collection.insert(driver, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				console.log('Sukces: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
};
 
exports.updateDriver = function(req, res) {
	var id = req.params.id;
	var driver = req.body;
	console.log('Edycja kierowcy: ' + id);
	console.log(JSON.stringify(driver));
	db.collection('drivers', function(err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, driver, {safe:true}, function(err, result) {
			if (err) {
				console.log('Error updating: ' + err);
				res.send({'error':'An error has occurred'});
			} else {
				console.log('' + result + ' document(s) updated');
				res.send(driver);
			}
		});
	});
};
 
exports.deleteDriver = function(req, res) {
	var id = req.params.id;
	console.log('Usuwanie taksiarza: ' + id);
	db.collection('drivers', function(err, collection) {
		collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error has occurred - ' + err});
			} else {
				console.log('' + result + ' document(s) deleted');
				res.send(req.body);
			}
		});
	});
};
 
/* 
 * Przykładowe dane w razie czystki w bazie.
 */
var insertDB = function() {
 
var drivers = [
{
	name: "Zbyszek",
	year: "2009",
	brand: "Polonez",
	bid: "5",
	isActive: "true",
	isFree: "false",
	position: ""
},
{
	name: "Zenek",
	year: "2002",
	brand: "Audi A6",
	bid: "4",
	isActive: "true",
	isFree: "false",
	position: ""
},
{
	name: "Zdzisiek",
	year: "2000",
	brand: "Volkswagen sharan",
	bid: "6",
	isActive: "true",
	isFree: "false",
	position: ""
},
{
	name: "Zygmunt",
	year: "2001",
	brand: "Volvo v40",
	bid: "6",
	isActive: "true",
	isFree: "false",
	position: ""
},
{
	name: "Ziemowit",
	year: "2000",
	brand: "Volkswagen sharan",
	bid: "6",
	isActive: "true",
	isFree: "false",
	position: ""
}
];
 
db.collection('drivers', function(err, collection) {
collection.insert(drivers, {safe:true}, function(err, result) {});
});
 
};