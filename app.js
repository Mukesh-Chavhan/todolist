//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://dipak123vag:Atg3ci6q4CpTT22f@cluster0.bwtnyxh.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB Atlas");
}).catch((error) => {
  console.log("Error connecting to MongoDB Atlas:", error);
});

const itemSchema = {
  name: String
};

const Item = mongoose.model("Item", itemSchema);

// Home Route
app.get("/", async function(req, res) {
  try {
    // Retrieve all items from the database
    const foundItems = await Item.find({});
    res.render("list", { listTitle: "Today", newListItems: foundItems });
  } catch (err) {
    console.log(err);
  }
});

// Add Item Route
app.post("/", async function(req, res) {
  const itemName = req.body.newItem;
  const item = new Item({ name: itemName });
  try {
    // Save the new item to the database
    await item.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

// Delete Item Route
app.post("/delete", async function(req, res) {
  const checkedItemId = req.body.checkbox;
  try {
    // Find and remove the selected item from the database
    await Item.findByIdAndRemove(checkedItemId);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

// About Route
app.get("/about", function(req, res) {
  res.render("about");
});

// Start the server
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
