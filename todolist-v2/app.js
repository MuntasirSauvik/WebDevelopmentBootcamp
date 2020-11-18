//jshint esvertodolist-v20sion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
var loginFlag = 0;
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//const MONGO_DEFAULT = "mongo://127.0.0.1:27017/database_name";
const MONGO_DEFAULT=""
let mongo_url = process.env.MONGO_URL || MONGO_DEFAULT;

mongoose.connect(mongo_url, {useNewUrlParser: true, useUnifiedTopology: true });
console.log("Connecting to MongoDB: " + mongo_url);

const itemsSchema = {
  name: String,
  completed: Boolean
};

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
  name: "Welcome to your todolist!",
  completed: false
});

const item2 = new Item({
  name: "Hit the + button to add a new item.",
  completed: false
});

const item3 = new Item({
  name: "<-- Hit this to delete an item.",
  completed: false
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0 && loginFlag == 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
          loginFlag = 1;
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });

});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list

        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });



});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }


});

app.post("/markComplete", function(req, res){
  const checkedItemId = req.body.itemId;
  const completed = !!req.body.completed;  // either true/false
  const listName = req.body.listName;
  const update = {completed: completed};

  if (listName === "Today") {
    Item.findOneAndUpdate({_id: checkedItemId}, update, function(err,foundList){
      if (!err) {
        console.log("foundList: "+ foundList);
        res.redirect("/");
      }
    });
  } else {
    List.findOne({name: listName}, function(err, foundList){
      if (!err){
        foundList.items.forEach((el) => {
            if(checkedItemId == el._id) {
              el.completed = completed;
            }
        });
        List.findOneAndUpdate({name: listName}, foundList, function(err, foundList2){
          if (!err) {
            res.redirect("/" + listName);
          }
        });
      }
    });
  }

});







app.get("/about", function(req, res){
  res.render("about");
});

// let port = process.env.PORT;
// if (port === null || port == "") {
//   port = 3000;
// }
//
// app.listen(port, function() {
//   console.log("Server has started Successfully!");
// });


app.listen(3001, function() {
  console.log("Server started on port 3001");
});
