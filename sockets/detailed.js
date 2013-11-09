exports.onConnect = function(db){
	var collection = db.collection('potties');
	//Returns a function to handle a connection to a socket
	return function(socket) {
		socket.on("detailed", function(data) {
			collection.findOne({_id: data.id}).toArray(function(e,docs){
				console.log(doc);
				socket.emit("potty", doc);
			});
		});
	}
};