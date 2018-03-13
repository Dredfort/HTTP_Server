//https://mlab.com/home

var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;

var app = express();
var jsonParser = bodyParser.json();
var url = "mongodb://Dredfort:Hfuyfhtr7822~@ds111279.mlab.com:11279/ue";

app.use(express.static(__dirname + "/public"));

var apiRouter = express.Router();
app.use("/api", apiRouter);
apiRouter.route("/users").get( function(req, res){
      
    mongoClient.connect(url, function(err, db){
        db.collection("users").find({}).toArray(function(err, users){
            res.send(users)
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
  
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});
