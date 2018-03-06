
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var formidable = require("formidable");

var port = 8888;

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

server.start(port, router.route, handle);
//------------------------------------------
var express = require("express");
var app = express();
var port = 3000;
app.get("/", function (request, response) {
    response.send("Hello from Express!");
});
app.listen(port, function(err) {
    if (err) {
        return console.log("something bad happened", err);
    }
    console.log("server is listening on", port);
});