// https://mlab.com/home
// http://10.0.1.172:3000/index.html
var serverPort = 3000; 

var fs = require("fs");

var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;
var url = "mongodb://Dredfort:Hfuyfhtr7822~@ds111279.mlab.com:11279/ue";

var ip = require("./ip");

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// для работы с promise
mongoose.Promise = global.Promise;
mongoose.connect(url);
// установка схемы
var userScheme = new Schema({
    name: { type: String, default: "NoName" },
    age: { type: Number, default: 22 }
});


app.use(function (request, response, next) {

    var now = new Date();
    var hour = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
   // console.log(data);
    fs.appendFile("server.log", data + "\n", function (err) {
        if (err) throw err;
        console.log(`${request.method}: request`);
    });
    next();
});
// http://10.0.1.172:3000/index.html
app.use(express.static(__dirname + "/public"));

var apiRouter = express.Router();
app.use("/api", apiRouter);
apiRouter.route("/users").get( function(req, res){
      
    mongoClient.connect(url, function(err, db){
        db.collection("users").find({}).toArray(function(err, users){
            users.sort(function (a, b) {
                if (a.age > b.age) return 1;
                if (a.age < b.age) return -1;
            });
            res.send(users);
            db.close();
        });
    });
});
apiRouter.route("/users/:id").get( function(req, res){
      
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("users").findOne({_id: id}, function(err, user){
             
            if(err) return res.status(400).send();
             
            res.send(user);
            db.close();
        });
    });
});
 
apiRouter.route("/users").post( jsonParser, function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
     
    var userName = req.body.name;
    var userAge = req.body.age;
    var user = {name: userName, age: userAge};
     
    mongoClient.connect(url, function(err, db){
        db.collection("users").insertOne(user, function(err, result){
             
            if(err) return res.status(400).send();
             
            res.send(user);
            db.close();
        });
    });
});
  
apiRouter.route("/users/:id").delete( function(req, res){
      
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("users").findOneAndDelete({_id: id}, function(err, result){
             
            if(err) return res.status(400).send();
             
            var user = result.value;
            res.send(user);
            db.close();
        });
    });
});
 
apiRouter.route("/users").put( jsonParser, function(req, res){
      
    if(!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    var userName = req.body.name;
    var userAge = req.body.age;
     
    mongoClient.connect(url, function(err, db){
        db.collection("users").findOneAndUpdate({_id: id}, { $set: {age: userAge, name: userName}},
             {returnOriginal: false },function(err, result){
             
            if(err) return res.status(400).send();
             
            var user = result.value;
            res.send(user);
            db.close();
        });
    });
});
  
app.listen(serverPort, function(){ console.log(`Server waiting for connection...[${ip.getLocalIP()}:${serverPort}]`);});
 ip.getIP();
