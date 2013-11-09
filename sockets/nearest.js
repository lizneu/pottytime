exports.onConnect = function(db){
	var collection = db.collection('potties');
	//Returns a function to handle a connection to a socket
	return function(socket){
		socket.on("nearest", function(data){
			console.log(data);
			var latRange = {$gte: data.sw_lat, $lt: data.ne_lat};
			var longRange = {$gte: data.sw_long, $lt: data.ne_long};
			collection.find({lat: latRange, long: longRange}).toArray(function(e,docs){
				socket.emit("nearby", docs);
			});
		});
	}
};