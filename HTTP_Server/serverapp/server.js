// http://localhost:3000/
// http://10.0.1.172:3000/
//------------------------------------------
var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");

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

    app.get("/", function (request, response) {
        
        response.send("Главная страница");
    });
    
    // Handlebars.
    //http://10.0.1.172:3000/contact
    app.set("view engine", "hbs");
    app.get("/contact", function(request, response){
     
        response.render("contact.hbs", {
            title: "Мои контакты",
            emailsVisible: true,
            emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
            phone: "+1234567890"
        });
    });

    //http://10.0.1.172:3000/register.html
    // создаем парсер для данных в формате json
    var jsonParser = bodyParser.json();
    app.use(express.static(__dirname + "/public"));
    app.post("/user", jsonParser, function (request, response) {
        if (!request.body) return response.sendStatus(400);
        console.log(request.body);
        response.json(`${request.body.userName} - ${request.body.userAge}`);
    });  

    // HTML page:
    // about.html
    //http://10.0.1.172:3000/static/about.html
    app.use("/static",express.static(__dirname + "/public"));

    // Sub categories. Read params/
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

    // начинаем прослушивать подключения на 3000 порту
    app.listen(port, function () { console.log("Server started.", port); });
}

exports.start = start;