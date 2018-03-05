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