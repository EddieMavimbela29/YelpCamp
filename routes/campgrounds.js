var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");



//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn ,function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            req.flash("error", "Campground could not be created");
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            req.flash("success", "Campground was created");
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err && !foundCampground ){
            req.flash('error', 'campground doesnt exist')
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT - edit selected campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){

    Campground.findById(req.params.id, function( err, foundCampground){
            res.render('campgrounds/edit', {campground : foundCampground});
    })
})

//UPDATE - update selected campground

router.put('/:id', middleware.checkCampgroundOwnership,  function(req, res){

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function( err, UpdatedCampground){
        if (err && !UpdatedCampground) {
            req.flash("error", "Campground could not be updated");
            res.redirect('/campgrounds')
        } else {
            req.flash("success", "Campground has been updated");
            res.redirect('/campgrounds/' + req.params.id)
           
        }

    })
})
//DELETE - delete selected campground
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, foundCampground){
        if (err) {
            req.flash("error", "Campground could not be deleted");
            res.redirect('/campgrounds')
        } else {
            req.flash("success", "You have deleted a campground!");
            res.redirect('/campgrounds')
        }
    });
});

module.exports = router;