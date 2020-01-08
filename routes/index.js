var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");




router.get("/", function(req, res){
        res.render("landing");
    });

  //SHOW LOGIN PAGE
router.get('/register', function(req, res){
    res.render('register');  
 })

 router.post('/register', function(req, res){
 
  const newUser = new User({
       username: req.body.username,
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       email: req.body.email,
       avatar: req.body.avatar,
  });
   if(req.body.adminCode === 'secretCode123'){
    newUser.isAdmin = true;
  }
   User.register(newUser,req.body.password, function(err, user){
       if (err) {
           console.log(err)
           res.render('register');
       } 
       passport.authenticate("local")(req,res, function(){
        req.flash("success", "Welcome to YelpCamp " + user.username); 
        res.redirect('/campgrounds')
       });
   });
});
 
 
router.get('/login', function(req, res){
   res.render('login'); 
 })

router.post('/login', passport.authenticate("local",
        {
           successRedirect: "/campgrounds",
           failureRedirect: "/login"
        }), function(req, res){
});

//USER - ROUTES
router.get('/users/:id', (req,res)=>{
  User.findById(req.params.id, function(err, foundUser){
          if (err) {
            req.flash("error", "User can't be accessed");
            res.redirect('/')
            console.log(err);
          } 
 Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campground){
           if (err) {
              req.flash("error", "User can't be accessed");
              res.redirect('/')
              console.log(err);
              } else {
                 res.render('users/show', {user: foundUser, campground: campground});
              }
            })          
  })
})

router.get('/logout', function(req, res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect('/campgrounds');
});

module.exports = router;
