var ObjectId = require('mongodb').ObjectID;

function update_ratings(potty, review) {
	var count = potty.reviews.length;
	var newRating = (count * potty.rating + review.rating) / (count + 1.0);
	console.log("NEW RATING = " + newRating);

}

exports.onConnect = function(db){
	var collection = db.collection('potties');
	//Returns a function to handle a connection to a socket
	return function(socket) {
		socket.on("add_review", function(data) {
			collection.findOne({_id: new ObjectId(data.id)}, function(e,doc) {
				console.log("erorr: " + e);
				console.log("detailed doc = " + doc);

				update_ratings(doc, data.review);
			});
		});
	}
};