var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
// ====================
// COMMENTS ROUTES
// ====================

router.get("/new", middleware.isLoggedIn,  function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

router.post("/", middleware.isLoggedIn,  function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           req.flash("error", "Campground has not been found");
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
            req.flash("error", "Comment has not been added");
               console.log(err);
           } else {
               //add comment to a campground
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success", "Comment has been added");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

//EDIT - edit comment associated with selected campground id
router.get('/:comment_id/edit', middleware.checkCommentOwnership,  function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err &&  !foundComment ) {
                req.flash("error", "Comment has not been updated");
                console.log(err)
            } else {
                res.render('comments/edit', {campground_id : req.params.id, comment : foundComment})
            }
    })
})
//UPDATE - update comment associated with selected campground id
router.put('/:comment_id', middleware.checkCommentOwnership,  function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundCampground){
       if (err  &&  !foundComment) {
        req.flash("error", "Comment has not been updated");
           console.log(err)
       } else {
        req.flash("success", "Comment has been updated");
           res.redirect('/campgrounds/' + req.params.id );
       }
   })
})

//DELETE - delete comment associated with selected campground id
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundCampground){
        if (err) {
            console.log(err)
            req.flash("error", "Comment has not been deleted");
            res.redirect('back')
        } else {
            req.flash("success", "Comment has been deleted");
            res.redirect('/campgrounds');
        }
    })
 })

 module.exports = router;