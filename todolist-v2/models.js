import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_DEFAULT = "mongodb://127.0.0.1:27017/TodoListDatabase";
let mongo_url = process.env.MONGO_URL || MONGO_DEFAULT;

mongoose.connect(mongo_url, {useNewUrlParser: true, useUnifiedTopology: true });
console.log("Connecting to MongoDB: " + mongo_url);

const itemsSchema = {
  name: String,
  completed: {type: Boolean, default: false}
};
const Item = mongoose.model("Item", itemsSchema);

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

export default mongoose;
export {itemsSchema, listSchema, Item, List};
