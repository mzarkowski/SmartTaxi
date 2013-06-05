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
		collection.find({isFree: "true", isActive: "true"}).toArray(function(err, items) {
			res.send(items);
		});
	});
	};	
 
	
exports.matchLoginAndPassword = function(req, res) {
	var name = req.body.name;
	var password = req.body.password;
	console.log('Logowanie' + name + password);
	db.collection('drivers', function(err, collection) {
		collection.find({name: name, password: password}).toArray(function(err, items) {
			res.send(items);
		});
	});
};
		
		
exports.addDriver = function(req, res) {
	var driver = req.body;
	console.log('Dodawanie kierowcy: ' + JSON.stringify(driver));
	db.collection('drivers', function(err, collection) {
		collection.insert(driver, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'error'});
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
				console.log('Error: ' + err);
				res.send({'error':'error'});
			} else {
				console.log('' + result + ' documents updated');
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
				res.send({'error':' ' + err});
			} else {
				console.log('' + result + ' document(s) deleted');
				res.send(req.body);
			}
		});
	});
};

exports.updateDriverCoords = function(driver) {
	var id = driver.driverId;
	db.collection('drivers', function(err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, { $set: {coords : {latitude : driver.latitude, longitude : driver.longitude}}}, {safe:true}, function(err, result) {
			if (err) {
				console.log('Error : ' + err);
			} else {
				console.log('Zaktualizowano pozycję dla kierowcy: ' + id);
			}
		});
	});
};

exports.updateDriverStatusFree = function(driver) {
	var id = driver.driverId;
	db.collection('drivers', function(err, collection) {
		//ZMIENIć na FALSE!
		collection.update({'_id':new BSON.ObjectID(id)}, { $set: {"isFree" : "true"}}, {safe:true}, function(err, result) {
			if (err) {
				console.log('Error : ' + err);
			} else {
				console.log('Kierowca ma kurs: ' + id);
			}
		});
	});
};
exports.updateDriverStatusBusy = function(driver) {
	var id = driver.driverId;
	db.collection('drivers', function(err, collection) {
		//ZMIENIć na FALSE!
		collection.update({'_id':new BSON.ObjectID(id)}, { $set: {"isFree" : "false"}}, {safe:true}, function(err, result) {
			if (err) {
				console.log('Error : ' + err);
			} else {
				console.log('Kierowca ma kurs: ' + id);
			}
		});
	});
};

exports.updateDriverAvailable = function(driver) {
	var id = driver.customId;
	db.collection('drivers', function(err, collection) {

		collection.update({'_id':new BSON.ObjectID(id)}, { $set: {"isActive" : "true"}}, {safe:true}, function(err, result) {
			if (err) {
				console.log('Error : ' + err);
			} else {
				console.log('Zalogowano kierowcę: ' + id);
			}
		});
	});
};

exports.updateDriverUnavailable = function(driver) {
	var id = driver.customId;
	db.collection('drivers', function(err, collection) {
		//ZMIENIć na FALSE!
		collection.update({'_id':new BSON.ObjectID(id)}, { $set: {"isActive" : "false"}}, {safe:true}, function(err, result) {
			if (err) {
				console.log('Error : ' + err);
			} else {
				console.log('Wylogowano kierowcę ' + id);
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
	password: "0cc175b9c0f1b6a831c399e269772661",
	year: "2009",
	brand: "Polonez",
	bid: "5",
	isActive: "true",
	isFree: "true",
	coords : {
		latitude: "54.389079",
		longitude: "18.622506"
	}
},
{
	name: "Zenek",
	year: "2002",
	password: "0cc175b9c0f1b6a831c399e269772661",
	brand: "Audi A6",
	bid: "4",
	isActive: "true",
	isFree: "true",
	coords : {
		latitude: "54.366108",
		longitude: "18.633914"
	}
},
{
	name: "Zdzisiek",
	year: "2000",
	password: "0cc175b9c0f1b6a831c399e269772661",
	brand: "Toyota Avensis",
	bid: "6",
	isActive: "true",
	isFree: "true",
	coords : {
		latitude: "54.352955",
		longitude: "18.645844"
	}
},
{
	name: "Zygmunt",
	year: "2001",
	password: "0cc175b9c0f1b6a831c399e269772661",
	brand: "Volvo v40",
	bid: "6",
	isActive: "true",
	isFree: "false",
	coords : {
		latitude: "54.352955",
		longitude: "18.645844"
	}
},
{
	name: "Ziemowit",
	year: "2000",
	password: "0cc175b9c0f1b6a831c399e269772661",
	brand: "Toyota Avensis",
	bid: "6",
	isActive: "true",
	isFree: "false",
	coords : {
		latitude: "54.352955",
		longitude: "18.645844"
	}
}
];
 
db.collection('drivers', function(err, collection) {
collection.insert(drivers, {safe:true}, function(err, result) {});
});
 
};