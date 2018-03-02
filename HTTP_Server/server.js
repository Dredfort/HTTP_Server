// http://localhost:8888/


var serverPort = 8888;
var htttp = require("http");

htttp.createServer(function (reqest, responce) {
    
    console.log(reqest);

    responce.writeHead(200, { "Content-Type": "text/plain" });
    responce.write("Hi there");
    responce.end();
}).listen(serverPort);

console.log("Server started. Port: %f", serverPort);