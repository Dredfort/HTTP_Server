// http://localhost:3000/
// http://localhost:3000/about/
//------------------------------------------
var express = require("express");
var app = express();
var fs = require("fs");

function start(port) {

    // logger. 
    // also use("/", (callback) {response.send();})
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

    // http://localhost:3000/categories/smatrphones/products/m7Note
    app.get("/categories/:categoryId/products/:productId", function (request, response) {
        var catId = request.params["categoryId"];
        var prodId = request.params["productId"];
      response.send(`Категория: ${catId}    Товар: ${prodId}`);
    });

    app.get("/", function (request, response) {

        response.send("<h1>Главная страница</h1>");
    });
    app.get("/about", function (request, response) {

        response.send("<h1>О сайте</h1>");
    });
    app.get("/contact", function (request, response) {

        response.send("<h1>Контакты</h1>");
    });

    // начинаем прослушивать подключения на 3000 порту
    app.listen(port, function () { console.log("Server started.", port); });
}

exports.start = start;