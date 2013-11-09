
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var nearest = require('./sockets/nearest')
var detailed = require('./sockets/detailed')
var add = require('./sockets/add')
var http = require('http');
var path = require('path');

var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var mongoUri = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/pottytime';
mongoClient.connect(mongoUri, function (err, db) {
	io.of("/nearest").on("connection", nearest.onConnect(db));
	io.of("/detailed").on("connection", detailed.onConnect(db));
	io.of("/add").on("connection", add.onConnect(db));
 });

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/nearest', function (req, res) {
  res.sendfile(__dirname + '/socket_test.html');
});
app.get('/detailed', function (req, res) {
  res.sendfile(__dirname + '/socket_test.html');
});


var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);
