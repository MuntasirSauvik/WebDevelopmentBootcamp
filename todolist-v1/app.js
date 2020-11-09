const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
// require('dotenv').config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  var today = new Date();
  var currentDay = today.getDay();
  var day = "";


  switch(currentDay) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Satruday";
      break;
    default:
      console.log("Error: current day is equal to: "+ currentDay);
  } 
  res.render("list.ejs",{kindOfDay: day});

});

app.listen(3001, function(){
  console.log("Server started on port 3001");
});
