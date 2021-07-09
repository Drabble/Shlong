let mongoose = require("mongoose");
let Schema = mongoose.Schema;

// Basic User Schema for Google Authentication
const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  dollars: {
    type: Number,
    default: 100000,
    required: true,
  },
  state: {
    type: String,
    enum: ["shlort", "shledium", "shlong"],
    default: "shledium",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
