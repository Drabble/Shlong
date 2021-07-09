const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
let mongoose = require("mongoose");
const User = mongoose.model("User");

require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      // options for strategy
      callbackURL: "http://localhost:3000/auth/google/callback/",
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value,
        email: profile.emails[0].value,
      };
      // check if user already exists
      let currentUser = await User.findOneAndUpdate(
        { googleId: profile.id },
        user
      );
      if (currentUser) {
        // already have the user -> return (login)
        return done(null, currentUser);
      } else {
        // register user and return
        const newUser = await new User(user).save();
        return done(null, newUser);
      }
    }
  )
);
