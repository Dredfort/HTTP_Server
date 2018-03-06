// http://localhost:8888/
// http://localhost:8888/start
// http://localhost:8888/upload

var http = require("http");
var url = require("url");
function start(serverPortroute, route, handle) {
    //Callback-function.
    function onRequest(request, response) {
        var postData = "";
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");

        request.setEncoding("utf8");

        // Event "data" lisetener.
        request.addListener("data", function (postDataChunk) {
            postData += postDataChunk;
            console.log("Received POST data chunk '" +
                postDataChunk + "'.");
        });

        // Event "end" lisetener.
        request.addListener("end", function () {
            route(handle, pathname, response, postData);
        });
    }

    http.createServer(onRequest).listen(serverPortroute);
    console.log("Server has started. Port [%d]", serverPortroute);
}

exports.start = start;
//------------------------------------------
// http://localhost:3000/
var express = require("express");
var app = express();
function startExpress(port, handle) {

    app.use(function (request, response, next) {
        console.log(request.headers);
        next();
    });
    app.use(function (request, response, next) {
        request.chance = Math.random();
        next();
    });

    app.get("/", function (request, response) {
        response.send("Hello from Express!");
    });

    app.get("/start", function (request, response) {
        handle["/start"](response);
    });

    app.use(function (err, request, response, next) {
        // логирование ошибки, пока просто console.log
        console.log(err);
        response.status(500).send("Something broke!");
    });

    app.listen(port, function (err) { console.log("server is listening on", port); });
}

exports.startExpress = startExpress;