const express = require("express");
const app = express();
require("./Model/User");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const authService = require("./Services/AuthService");
const passportSetup = require("./config/passport-setup");
const cors = require("cors");
const User = mongoose.model("User");
require("./ws/binance");

require("dotenv").config();

app.use(cors());

const mongodbUri = process.env.MONGO_URI;
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

mongoose.connect(
  mongodbUri,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (error) => {
    if (error) console.error(error);
  }
);

app.use(function (req, res, next) {
  let allowedOrigins = ["*"]; // list of url-s
  let origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Expose-Headers", "Content-Disposition");
  next();
});
app.use(passport.initialize());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + "/"));
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// ############# GOOGLE AUTHENTICATION ################
// this will call passport-setup.js authentication in the config directory

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Shlong API</h1>");
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    accessType: "offline",
    approvalPrompt: "force",
  })
);

app.get("/users", authService.checkTokenMW, async (req, res) => {
  try {
    const authData = await authService.verifyToken(req, res);
    const users = await User.find();
    res.status(200).send(
      users.map((user) => ({
        displayName: user.displayName,
        image: user.image,
        createdAt: user.createdAt,
        dollars: user.dollars,
      }))
    );
  } catch (err) {
    res.sendStatus(403);
  }
});

app.get("/users/me", authService.checkTokenMW, async (req, res) => {
  try {
    const authData = await authService.verifyToken(req, res);
    const user = await User.findById(authData.userId);
    if (user)
      res.status(200).send({
        displayName: user.displayName,
        image: user.image,
        createdAt: user.createdAt,
        dollars: user.dollars,
        state: user.state,
      });
    else res.sendStatus(404);
  } catch (err) {
    res.sendStatus(403);
  }
});

app.post("/state/:state", authService.checkTokenMW, async (req, res) => {
  try {
    const authData = await authService.verifyToken(req, res);
    await User.updateOne(
      { _id: authData.userId },
      { $set: { state: req.params.state } }
    );
    res.status(204).send();
  } catch (err) {
    res.sendStatus(403);
  }
});

// callback url upon successful google authentication
app.get(
  "/auth/google/callback/",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      let token = authService.signToken(req, res);
      res.status(200).send({ token });
    } catch (err) {
      res.sendStatus(403);
    }
  }
);

app.listen(5000, function () {
  console.log("Express app listening on port 5000!");
});
