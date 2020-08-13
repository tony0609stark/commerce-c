var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


router.get("/new",middleware.isLoggedIn, function(req,res){
  res.render("campgrounds/new")
});
// SHOWS MORE INFO
router.get("/:id", function(req, res){

Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
  if(err){
    console.log(err);
  }else{
    console.log(foundCampground);
    res.render("campgrounds/show", {campground: foundCampground, currentuser: req.user});
  }
});
});

//edit campground route
router.get("/:id/edit", middleware.checkcampgroundownership, function(req, res){
  // is user logged in or not
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        req.flash("error", "Campground not found");
      }else{
        res.render("campgrounds/edit", {campground: foundCampground, currentuser: req.user});
      }
    });
});
//update campground route
router.put("/:id", middleware.checkcampgroundownership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

router.get("/", function(req,res){

  Campground.find({},function(err,campgrounds){
    if(err){
      console.log(err);
    }else{
      res.render("campgrounds/index", {campgrounds: campgrounds, currentuser: req.user});
    }
  });
});

//Create a new campground only after logging in
router.post("/",middleware.isLoggedIn, function(req,res){
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground ={name: name, image:image, price: price, description:desc, author:author}
  Campground.create(newCampground, function(err, newlycreated){
    if(err){
      console.log(err);
    }else{
      res.redirect("/campgrounds");
    }
  });
});

//destroy campground routes

router.delete("/:id", middleware.checkcampgroundownership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
