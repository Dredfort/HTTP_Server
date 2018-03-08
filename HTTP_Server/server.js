// http://localhost:3000/
// http://10.0.1.172:3000/
//------------------------------------------
var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var hbs = require("hbs");

function start(port) {
 
    // logger. 
    // also use("/", (callback) {response.send();})
    app.use(function (request, response, next) {

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

// Handlebars.
    hbs.registerPartials(__dirname + "/views/partials");
    app.set("view engine", "hbs");
    //http://10.0.1.172:3000/
    app.get("/", function(request, response){
        
        response.render("home.hbs");
    });
    //http://10.0.1.172:3000/contact
    app.get("/contact", function(request, response){
         
        response.render("contact.hbs", {
            title: "Мои контакты",
            email: "gavgav@mycorp.com",
            phone: "+1234567890"
        });
    });
// Handlebars.

// HTML page
    //http://10.0.1.172:3000/register.html
    app.use(express.static(__dirname + "/views"));
    //http://10.0.1.172:3000/static/about.html
    app.use("/static", express.static(__dirname + "/views"));
    // создаем парсер для данных в формате json
    var jsonParser = bodyParser.json();
    app.post("/user", jsonParser, function (request, response) {
        if (!request.body) return response.sendStatus(400);
        console.log(request.body);
        response.json(`${request.body.userName} - ${request.body.userAge}`);
    });
// HTML page

// Sub categories. Read params.
    // http://localhost:3000/categories/smatrphones/products/m7Note
    app.get("/categories/:categoryId/products/:productId", function (request, response) {
        var catId = request.params["categoryId"];
        var prodId = request.params["productId"];
        response.send(`Категория: ${catId}    Товар: ${prodId}`);
    });

    // Router with sub route.
    // http://localhost:3000/products
    var productRouter = express.Router();
    app.use("/products", productRouter);
    productRouter.route("/").get(function (request, response) {

        response.send("Список товаров");
    });
    productRouter.route("/:id").get(function (request, response) {

        response.send(`Товар ${request.params.id}`);
    });
// Sub categories. Read params.

// UE4 reader.
    var ue4Router = express.Router();
    app.use("/ue4", ue4Router);
    // // http://10.0.1.172:3000/ue4/class/
    ue4Router.route("/class/:classId").get(function(request, response){
        var clId = request.params["classId"];
        console.log("UE4 log>>> [%s]", clId);
        response.send(`Class: ${clId}`);
    });
    ue4Router.route("/stats").post(jsonParser, function (request, response) {
        if(!request.body) return response.sendStatus(400);
        console.log(request.body);
      response.send(`${request.body.Name}`);
    });
// UE4 reader.

    // начинаем прослушивать подключения на 3000 порту
    app.listen(port, function () { console.log("Server started.", port); });
}

exports.start = start;