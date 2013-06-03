var ST = ST || {};
ST.Drivers = ST.Drivers || {};
ST.Drivers.driverSelected = {};
ST.Drivers.Driver = function (id, name, year, brand, bid) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.brand = brand;
    this.bid = bid;
};
ST.Drivers.Array = [];
ST.Drivers.Time = [];
ST.Drivers.who = "";