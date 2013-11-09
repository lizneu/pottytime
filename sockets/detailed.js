var ObjectId = require('mongodb').ObjectID;

exports.onConnect = function(db){
	var collection = db.collection('potties');
	//Returns a function to handle a connection to a socket
	return function(socket) {
		socket.on("detailed", function(data) {
			collection.findOne({_id: new ObjectId(data.id)}, function(e,doc) {
				console.log("erorr: " + e);
				console.log("detailed doc = " + doc);
				socket.emit("potty", doc);
			});
		});
	}
};