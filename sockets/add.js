exports.onConnect = function(db){
	var collection = db.collection('potties');
	//Returns a function to handle a connection to a socket
	return function(socket){
		socket.on("add", function(data){	
			collection.insert(data, function(err, result){
				console.log(err);
				console.log(result);
				if (err || result.length != 1){
					socket.emit("fail", err);
				} else {
					potty = result.shift();
					socket.emit("success", potty._id);
				}
			});
		});
	};
}