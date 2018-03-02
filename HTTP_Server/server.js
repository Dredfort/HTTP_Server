
var htttp = require("http");

htttp.createServer(function (reqest, responce) {
    responce.writeHead(200, { "Content-Type": "text/plain" });
    responce.write("Hi there");
    responce.end();
}).listen(8888);