//jshint esvertodolist-v20sion:6
import mongoose, {itemsSchema, listSchema, Item, List} from "./models.js";
import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const defaultStrings = [
  "Welcome to your todolist!",
  "Hit the + button to add a new item.",
  "<-- Hit this to delete an item"
]

const defaultItems = defaultStrings.map((el) => {
  return new Item({name: el});
});

app.get("/", function(req, res) {

  res.redirect("/home");
  // Item.find({}, function(err, foundItems){
  //
  //   if (foundItems.length === 0 && loginFlag == 0) {
  //     Item.insertMany(defaultItems, function(err){
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log("Successfully savevd default items to DB.");
  //         loginFlag = 1;
  //       }
  //     });
  //     res.redirect("/");
  //   } else {
  //     res.render("list", {listTitle: "Today", newListItems: foundItems});
  //   }
  // });

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
          res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });
});

app.post("/addItem", function(req, res){

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
  const listName = req.body.listName;
  List.findOne({name: listName}, function(err, foundList){
    if (!err){
      const newList = [];
      foundList.items.forEach((el) => {
          if(!el.completed) {
            newList.push(el);
          }
      });
      foundList.items = newList;
      List.findOneAndUpdate({name: listName}, foundList, function(err, foundList2){
        if (!err) {
          res.redirect("/" + listName);
        }
      });
    }
  });
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

let port = process.env.PORT;
if (!port) {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully on port " + port + "!");
});
