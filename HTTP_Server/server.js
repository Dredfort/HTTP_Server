// http://localhost:8888/
// http://localhost:8888/start
// http://localhost:8888/upload

var htttp = require("http");
var url = require("url");

function start(serverPort, route, handle) {

    function onRequest (reqest, responce) {

        var pathName = url.parse(reqest.url).pathname;
        console.log("Request for [%s] received", pathName);

        route(handle, pathName);

        responce.writeHead(200, { "Content-Type": "text/plain" });
        responce.write("Hi bro!");
        responce.end();
    }

    htttp.createServer(onRequest).listen(serverPort);
    console.log("Server has started. Port: [%f]", serverPort);
}

exports.start = start;