
const express = require("express");

const app = express();

app.get("/",function(req,res){
  res.send("<h1>Hello, World!</h1>");
})

app.get("/contact",function(req,res){
  res.send("Contact me at muntasir.sauvik@usask.ca");
})

app.get("/about",function(req,res){
  res.send("My name is Sauvik and I love mango juice :) and coding.");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
