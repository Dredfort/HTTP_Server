const request = require("supertest");
 
var app = require("./app").app;
 
it("should return Hello Test", function(done){
     
    request(app)
        .get("/")
        .expect("index.html")
        .end(done);
});