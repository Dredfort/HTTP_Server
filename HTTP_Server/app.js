var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
 
var app = express();
var jsonParser = bodyParser.json();

var serverPort = 3000; 
var ip = require("./ip");
app.use(function (request, response, next) {

    var now = new Date();
    var hour = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
   // console.log(data);
    fs.appendFile("server.log", data + "\n", function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
    next();
});
// http://10.0.1.172:3000/index.html
app.use(express.static(__dirname + "/public")); 
// Routing API
var apiRouter = express.Router();
app.use("/api",apiRouter);
// получение списка данных 
apiRouter.route("/users").get( function(req, res){
      
    var content = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(content);
    res.send(users);
});
// получение одного пользователя по id
apiRouter.route("/users/:id").get( function(req, res){
      
    var id = req.params.id; // получаем id
    var content = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(content);
    var user = null;
    // находим в массиве пользователя по id
    for(var i=0; i<users.length; i++){
        if(users[i].id==id){
            user = users[i];
            break;
        }
    }
    // отправляем пользователя
    if(user){
        res.send(user);
    }
    else{
        res.status(404).send();
    }
});
// получение отправленных данных
apiRouter.route("/users").post( jsonParser, function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
     
    var userName = req.body.name;
    var userAge = req.body.age;
    var user = {name: userName, age: userAge};
     
    var data = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(data);
     
    // находим максимальный id
    var id = Math.max.apply(Math,users.map(function(o){return o.id;}));
    // увеличиваем его на единицу
    user.id = id+1;
    // добавляем пользователя в массив
    users.push(user);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("users.json", JSON.stringify(users));
    res.send(user);
});
 // удаление пользователя по id
 apiRouter.route("/users/:id").delete( function(req, res){
      
    var id = req.params.id;
    var data = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(data);
    var index = -1;
    // находим индекс пользователя в массиве
    for(var i=0; i<users.length; i++){
        if(users[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем пользователя из массива по индексу
        var user = users.splice(index, 1)[0];
        fs.writeFileSync("users.json", JSON.stringify(users));
        // отправляем удаленного пользователя
        res.send(user);
    }
    else{
        res.status(404).send();
    }
});
// изменение пользователя
apiRouter.route("/users").put( jsonParser, function(req, res){
      
    if(!req.body) return res.sendStatus(400);
     
    var userId = req.body.id;
    var userName = req.body.name;
    var userAge = req.body.age;
     
    var users = JSON.parse(fs.readFileSync("users.json", "utf8"));
    var user;
    for(var i=0; i<users.length; i++){
        if(users[i].id==userId){
            user = users[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if(user){
        user.age = userAge;
        user.name = userName;
        fs.writeFileSync("users.json", JSON.stringify(users));
        res.send(user);
    }
    else{
        res.status(404).send(user);
    }
});
  
 app.listen(serverPort, function(){ console.log(`Server waiting for connection...[${ip.getLocalIP()}:${serverPort}]`);});
 ip.getIP();

 module.exports.app = app;
