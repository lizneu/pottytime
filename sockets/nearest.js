
function distance(a, b){
	console.log(a);
	console.log(b);
	return Math.pow(Math.pow(a.lat-b.lat, 2) + Math.pow(a.long-b.long, 2), 1/2);
}

function nearest(potties, loc){
	for (var i = 0; i < potties.length; i++){
		potty = potties[i];
		potty.distance = distance(potty, loc);
	}
	return potties.sort(function(a,b){return a.distance - b.distance});
}

exports.onConnect = function(db){
	var collection = db.collection('potties');
	//Returns a function to handle a connection to a socket
	return function(socket){
		socket.on("nearest", function(data){
			console.log(data);
			var min = 10;
			var max = 10;
			var latRange = {$gte: data.lat-min, $lt: data.lat+max};
			var longRange = {$gte: data.long-min, $lt: data.long+max};
			console.log(latRange);
			console.log(longRange);
			collection.find({lat: latRange, long: longRange}).toArray(function(e,docs){
				var nearestPotties = nearest(docs, data);
				socket.emit("nearby", nearestPotties);
			});
		});
	}
};