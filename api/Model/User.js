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
    required: false,
  },
  lastName: {
    type: String,
    required: false,
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
    default: 1000000,
    required: true,
  },
  btc: {
    type: Number,
    default: 0,
    required: true,
  },
  btcPriceAtLastStateChange: {
    type: Number,
    default: 1000000,
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
