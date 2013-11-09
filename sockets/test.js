
exports.onConnect = function(){
	return function(socket){
		socket.emit("test", {hi: "HIIIII"});
		socket.on("test2", function(){
			console.log("test2 yay!");
		});
	}
};