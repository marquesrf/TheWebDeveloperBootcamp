var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var flash = require('connect-flash');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var authRoutes = require("./routes/index");
//var seedDB = require("./seeds");

var app = express();
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
//seedDB();
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// ==========================
// PASSPORT CONFIGURATION
// ==========================
app.use(
  require("express-session")({
    secret: "The birds are all falling!",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==========================
// CUSTOM MIDDLEWARE
// ==========================
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// ==========================
//          ROUTES
// ==========================
app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function () {
  console.log("YelpCamp is running on port 3000.");
});
