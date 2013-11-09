//mongo setup
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');

var collection = db.get('pottys');
collection.find({lat: {$gte: 45, $lt: 51}, long: {$gte: 45, $lt: 51}},{}, function(e,docs){
	console.log(docs.each(function(doc){ doc.a= 1;}));
});