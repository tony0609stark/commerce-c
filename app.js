var express = require("express"),
    request = require("request"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    ejs = require("ejs"),
    flash = require("connect-flash"),
    passport = require("passport"),
    methodoverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment"),
    app = express();

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/auth");

// seedDB();
// connect to database
mongoose.connect("mongodb+srv://sahil:12345@yelpcampv2.qodd3.mongodb.net/yelpcampv2?retryWrites=true&w=majority");
// mongodb+srv://sahil:sahil99@yelpcamp.feixq.mongodb.net/<yelpcamp>?retryWrites=true&w=majority
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodoverride("_method"));
app.use(flash());


//schema setup
// var campgroundSchema =  new mongoose.Schema({
//   name: String,
//   image: String,
//   description: String
// });
// var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Camp Chika",
//     image:"https://images.unsplash.com/photo-1571687949921-1306bfb24b72?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     description: "This is the best waifu camp you can find!!"
//
//   },function(err, campground){
//     if(err){
//       console.log("error");
//     }else{
//       console.log("newly created data");
//       console.log(campground);
//     }
//   });

var campgrounds = [
  {name: "Sahil", image:"https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
  {name: "Camp Green Lake", image:"https://images.unsplash.com/photo-1487750404521-0bc4682c48c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
  {name: "Camp Chika", image:"https://images.unsplash.com/photo-1571687949921-1306bfb24b72?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
];

app.use(require("express-session")({
  secret:"Anime is life",
  resave: false,
  saveUninitiliaze: false
}));


app.use(function(req, res, next){
  res.locals.currentuser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT||3000,process.env.IP,function(){
 console.log('yelpcamp has started')
});
