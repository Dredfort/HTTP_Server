var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

var app = express();
var jsonParser = bodyParser.json();

app.use(express.static(__dirname + "/public"));
// получение списка данных
app.get("/api/users", function (req, res) {

    var content = fs.readFileSync("users.json", "utf-8");
    var users = JSON.parse(content);
    res.send(users);
});
// получение одного пользователя по id
app.get("/api/users/:id", function (req, res) {

    var id = req.param.id;
    var content = fs.readFileSync("users.json","utf-8");
    var users = JSON.parse(content);
    var user = null;
    // находим в массиве пользователя по id
    for(var i=0 ; i < users.lenght; i++)    {
        if (users[i].id == id) {
            user = users[i];
            break;
        }        
    }

    if (user) {
        res.send(user);
    }
    else{
        res.status(404).send();
    }
});