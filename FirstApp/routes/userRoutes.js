const User = require("../models/User")
const bcrypt = require('bcryptjs')
const express = require("express")
// const home = require('../pages/home')
const router = express.Router();
const passport = require("passport")
const flash = require('connect-flash')

router.get("/", function(req, res){
    // res.send("hello server is working");
    res.render("home");
});

router.get('/login', function(req,res){
    res.render('log_in');
});

router.get('/details', function(req,res){
    res.render('products_details');
});

router.get('/products', function(req,res){
    res.render('product');
});

router.get('/register', function(req, res){
    res.render('sign_up');
    // res.send('hello')
})

router.post("/register", (req,res) => {
    console.log(req.body)
    const {firstname, lastname, email, password, password2} = req.body;
    const errors = []
    //check for errors

    if(!firstname || !lastname || !email || !password || !password2){
      errors.push({ msg: 'Please fill in all fields'});
    }

    if(password !== password2){
      errors.push({ msg: 'Passwords do not match'});

    }
  //password length
  if(password.length < 6){
    errors.push({msg:'Password should contain at least 6 characters'})
  }

  if(errors.length > 0){
    console.log(errors)
    res.render('sign_up', {
      errors,
      firstname,
      lastname,
      email, 
      password,
      password2
    });
  }else{
    // res.send('pass')
    User.findOne({email:email})
    .then(user => {
      if(user) {
        errors.push({msg:'Email is already registered'})
        res.render('sign_up', {
          errors,
          firstname,
          lastname,
          email, 
          password,
          password2
        });
      } else{
        const newUser = new User({
          firstname:firstname,
          lastname:lastname,
          email: email,
          password:password
        });
        console.log(newUser)
        bcrypt.genSalt(10, (err, salt) =>{
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password =  hash
            newUser.save().then(user => {
              res.redirect('/login')
            })
            .catch(err => {console.log(err)})
          })
        })
        res.send('User registered');
      }
    })
  }
});

router.post('/login', (req,res, next) => {
  passport.authenticate('local',{ successRedirect: '/home',failureRedirect: '/login'})(req, res, next)
  // res.redirect('/home');
})

module.exports = router;