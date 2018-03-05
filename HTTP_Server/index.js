
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var port = 8888;

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

server.start(port, router.route, handle);