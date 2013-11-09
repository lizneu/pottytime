exports.onConnect = function(db){
	var collection = db.collection('potties');
	//Returns a function to handle a connection to a socket
	return function(socket){
		socket.on("add", function(data){	
			collection.insert(data, function(err, result){
				socket.emit("potty", result);
			});
		});
	};
}