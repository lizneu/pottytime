exports.onConnect = function(db){
	var collection = db.get('potties');
	//Returns a function to handle a connection to a socket
	return function(socket) {
		socket.on("detailed", function(data) {
			collection.findOne({_id: data.id}, {}, function(err, doc) {
				console.log(doc);
				socket.emit("potty", doc);
			});
		});
	}
};