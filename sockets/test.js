var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var mongoUri = 'mongodb://localhost:27017/pottytime';
var ObjectId = require('mongodb').ObjectID;

mongoClient.connect(mongoUri, function (err, db) {
	var collection = db.collection("potties");
	collection.findOne({_id: new ObjectId("527e96d5c808a12d3a000001")}, function(e,docs){
		console.log(docs);
		collection.update({_id: new ObjectId("527e96d5c808a12d3a000001")}, {$push: {"reviews": {"rating": 4, "review": "SO FREEING"}}}, function(err, doc) {});
	});
 });
