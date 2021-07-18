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
require("./ws/binance")(app);

app.btc_price = 1;

require("dotenv").config();

app.use(cors());

const mongodbUri = process.env.SHLONG_MONGO_URI;
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

mongoose.connect(mongodbUri, { useUnifiedTopology: true, useNewUrlParser: true }, (error) => {
  if (error) console.error(error);
});

app.use(function (req, res, next) {
  let allowedOrigins = ["*"]; // list of url-s
  let origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
  }),
);

app.get("/users", authService.checkTokenMW, async (req, res) => {
  try {
    const authData = await authService.verifyToken(req, res);
    const users = await User.find().sort("-btc").exec();
    res.status(200).send(
      users
        .map((user) => {
          let dollars = user.state === "shlong" ? (user.btc * app.btc_price - user.dollars) * 10 + user.dollars : user.state === "shlort" ? -(user.btc * app.btc_price - user.dollars) * 10 + user.dollars : user.dollars;
          return {
            displayName: user.displayName,
            image: user.image,
            createdAt: user.createdAt,
            dollars: dollars,
            btc: dollars / app.btc_price,
          };
        })
        .sort((a, b) => b.btc - a.btc),
    );
  } catch (err) {
    console.error(err);
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
        btc: user.btc,
        state: user.state,
        btc_price: app.btc_price,
      });
    else res.sendStatus(404);
  } catch (err) {
    res.sendStatus(403);
  }
});

app.post("/state/:state", authService.checkTokenMW, async (req, res) => {
  try {
    const authData = await authService.verifyToken(req, res);
    const user = await User.findOne({ _id: authData.userId });

    // Compute new money based on shlong/shlort, minimum 0, or liquidated?!?
    if (user.state === "shlong") {
      user.dollars = (app.btc_price / user.btcPriceAtLastStateChange - 1) * 10 * user.dollars + user.dollars;
    } else if (user.state === "shlort") {
      user.dollars = (1 - app.btc_price / user.btcPriceAtLastStateChange) * 10 * user.dollars + user.dollars;
    }
    user.dollars = user.dollars < 0 ? 0 : user.dollars;

    // Set btc price before last state change
    user.btc = user.dollars / app.btc_price;
    user.btcPriceAtLastStateChange = app.btc_price;

    // Update state
    user.state = req.params.state;

    user.save();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.sendStatus(403);
  }
});

// callback url upon successful google authentication
app.get("/auth/google/callback/", passport.authenticate("google", { session: false }), (req, res) => {
  try {
    let token = authService.signToken(req, res);
    res.status(200).send({ token });
  } catch (err) {
    res.sendStatus(403);
  }
});

app.listen(5000, function () {
  console.log("Express app listening on port 5000!");
});
