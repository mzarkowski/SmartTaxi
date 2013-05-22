exports.findAll = function(req, res) {
	res.send([{name:'driver1'}, {name:'driver2'}, {name:'driver3'}]);
};
 
exports.findById = function(req, res) {
	res.send({id:req.params.id, name: "The Name", description: "description"});
};