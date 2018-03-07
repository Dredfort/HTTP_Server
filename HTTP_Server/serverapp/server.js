// http://localhost:3000/
// http://localhost:3000/about/
//------------------------------------------
var express = require("express");
var app = express();
var fs = require("fs");

function start(port) {

    app.get("/", function(request, response){
     
        response.send("<h1>Главная страница</h1>");
    });
    app.get("/about", function(request, response){
         
        response.send("<h1>О сайте</h1>");
    });
    app.get("/contact", function(request, response){
         
        response.send("<h1>Контакты</h1>");
    });
    // начинаем прослушивать подключения на 3000 порту
    app.listen(port, function () { console.log("Server started.", port); });
}

exports.start = start;