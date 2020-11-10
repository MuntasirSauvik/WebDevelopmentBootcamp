const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

const date = require(__dirname + "/date.js");

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {

  const day = date.getDate();

  res.render("list.ejs", {
    listTitle: day,
    newListItems: items
  });

});

app.post("/", function(req, res) {

  const item = req.body.newItem;

  if (req.body.list === "Work") {
      workItems.push(item);
      res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", {listTitle: "Work List", newListItems: workItems});
})

app.post("/work", function(req, res) {
  const item = req.body.newItem;
  res.redirect("/work");
})

app.get("/about", function(req, res) {
  res.render("about");
})

app.listen(3001, function(){
  console.log("Server started on port 3001");
});
