var ObjectId = require('mongodb').ObjectID;

exports.onConnect = function(db){
	var collection = db.collection('potties');
	//Returns a function to handle a connection to a socket
	return function(socket) {
		socket.on("add_review", function(data) {
			collection.findOne({_id: new ObjectId(data.id)}, function(e, potty) {
				console.log("erorr: " + e);
				console.log("detailed doc = " + potty);

				var count = potty.reviews.length;
				var newRating = (count * potty.rating + data.rating) / (count + 1.0);
				console.log("NEW RATING = " + newRating);

				collection.update({_id: new ObjectId(data.id)}, {$set: {rating: newRating}}, function(err, doc) {});
				collection.update({_id: new ObjectId(data.id)}, {$push: {"reviews": {"rating": data.rating, "review": data.review}}}, function(err, doc) {});
			});
		});
	}
};