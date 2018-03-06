// http://localhost:8888/
// http://localhost:8888/start
// http://localhost:8888/upload
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
        response.json({
            chance: request.chance
        });
    });

    app.use(function (err, request, response, next) {
        // логирование ошибки, пока просто console.log
        console.log(err);
        response.status(500).send("Something broke!");
    });

    app.listen(port, function (err) { console.log("server is listening on", port); });

    app.addListener("end", function() {
        console.log("err");
      });
}

exports.startExpress = startExpress;