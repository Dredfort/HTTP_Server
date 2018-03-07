// http://localhost:3000/
// http://localhost:3000/about/
//------------------------------------------
var express = require("express");
var app = express();
var fs = require("fs");

function start(port) {

    app.use(function(request, response, next){
     
        var now = new Date();
        var hour = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
        console.log(data);
        fs.appendFile("server.log", data + "\n", function (err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        });
        next();
    });
    app.use("/about", function(request, response, next){
         
        console.log("About Middleware");
        response.send("About Middleware");
    });
     
    app.get("/", function(request, response){
        console.log("Route /");
        response.send("Hello");
    });

    // начинаем прослушивать подключения на 3000 порту
    app.listen(port, function () { console.log("Server started.", port); });
}

exports.start = start;