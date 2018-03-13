var mongoClient = require("mongodb").MongoClient;
 
var url = "mongodb://Dredfort:Hfuyfhtr7822~@ds111279.mlab.com:11279/ue";

mongoClient.connect(url, function(err, db){
     
    if(err){ 
        return console.log(err);
    }
    var collection = db.collection("users");
    var user = {name: "Tom", age: 23};
    collection.insertOne(user, function(err, result){
         
        if(err){ 
            return console.log(err);
        }
        console.log(result.ops);
        db.close();
    });
});