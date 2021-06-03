const express = require("express");
const app = express()
const bodyParser = require("body-parser")
const methodoverride = require("method-override")
const LocalStrategy = require("passport-local")
const passport = require("passport")
const ejs = require('ejs')
const mongoose = require("mongoose");
const User = require('./models/User')
const userRoutes = require('./routes/userRoutes')
const flash = require('connect-flash')


//passport config
require('./config/passport')(passport)

mongoose.connect("mongodb+srv://user1:password1234@commerce-c.jzsdf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser:true,  useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));
app.use(methodoverride("_method"));

app.use(require("express-session")({
    secret:"Anime is life",
    resave: false,
    saveUninitiliaze: false
  }));


app.use(flash());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
//Global messages
app.use(function(req, res, next){
    res.locals.currentuser = req.user;
    res.locals.error_msg = req.flash("error");
    res.locals.error = req.flash("error");
    res.locals.success_msg = req.flash("success");
    next(); 
  });

app.use("/",(userRoutes));




app.listen(5000, () =>{
    console.log("Hello There, Nice to see you!!!")
})

// mongodb+srv://user1:<password>@commerce-c.jzsdf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority