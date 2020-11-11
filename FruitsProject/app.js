const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/fruitsDB", {useNewUrlParser: true, useUnifiedTopology: true})

const fruitSchema = new mongoose.Schema ({
  name: {
    type:String,
    required: [true, "Please check your data entry, no name specified!"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);

// const mango = new Fruit ({
//   name: "Mango",
//   rating: 6,
//   review: "Decent fruit"
// });
//
// mango.save();

const personSchema = new mongoose.Schema ({
  name: String,
  age: Number,
  favouriteFruit: fruitSchema
});

const Person = mongoose.model("Person", personSchema);

// const pineapple = new Fruit ({
//   name: "Pineapple",
//   score: 9,
//   review: "Great fruit."// fruit
// });
//
// pineapple.save();
//
// const person = new Person ({
//   name: "Amy",
//   age: 12,
//   favouriteFruit: pineapple
// });
//
// person.save();
//
// const kiwi = new Fruit({
//   name: "Kiwi",
//   score: 10,
//   review: "The best fruit!"
// });
//
// const orange = new Fruit({
//   name: "Orange",
//   score: 4,
//   review: "Too sour for me"
// });
//
// const banana = new Fruit({
//   name: "Banana",
//   score: 3,
//   review: "Weird texture"
// });

// Fruit.insertMany([kiwi, orange, banana], function(err){
//   if(err) {
//     console.log("Error: " + err);
//   } else {
//     console.log("Successfully saved all the fruits to fruits DB");
//   }
// });


Fruit.find(function(err, fruits){
  if(err) {
    console.log(err);
  } else {

    mongoose.connection.close();
    fruits.forEach(function(fruit){
      console.log(fruit.name);
    });
  }
});


// Fruit.updateOne({_id: "5fabf3ff125e1ce977a70ddc"}, {name: "Peach"}, function(err){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("Successfully updated the document.");
//   }
// });

// Person.updateOne({name: "John"}, {favouriteFruit: mango}, function(err){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("Successfully updated the document.");
//   }
// });



// Fruit.deleteOne({_id: "5fabf3ff125e1ce977a70ddc"}, function(err){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("Successfully deleted the document.");
//   }
// });
//


Person.deleteOne({_id: "5fabfaeb5c5df9f1c0bc85bc"}, function(err){
  if(err){
    console.log(err);
  } else {
    console.log("Successfully deleted the document.");
  }
});



Fruit.deleteOne({_id: "5fabfaeb5c5df9f1c0bc85bb"}, function(err){
  if(err){
    console.log(err);
  } else {
    console.log("Successfully deleted the document.");
  }
});


// Person.deleteMany({name: "John"}, function(err){
//     if(err){
//       console.log(err);
//     } else {
//       console.log("Successfully deleted the document.");
//     }
//   });


const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('fruits');
  // Find some documents
  collection.find({}).toArray(function(err, fruits) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(fruits)
    callback(fruits);
  });
};
