var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
  res.render("home", {currentuser: req.user});
});
//AUTH ROUTES
//=======================
router.get("/register", function(req,res){
  res.render("sign_up");
});

router.post("/register", function(req,res){
  console.log(req.body.username)
  var newUser = ({username:req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
        req.flash("error", err);
        return res.render("sign_up");
    }
    passport.authenticate("local")(req,res, function(){
      req.flash("success", "Welcome" + user.username);
      res.redirect("/");
    });
  });
});

//show login form

router.get("/login", function(req, res){
  res.render("log_in");
});

router.post("/login", passport.authenticate("local",
 {
   successRedirect: "/",
   failureRedirect: "/login",
   failureFlash: true }),
   function(req, res){
});

//logic route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "logged you out!");
  res.redirect("/");
});


// Product details
router.get('/product', function(req, res){
  res.render("product")
})




module.exports = router;
