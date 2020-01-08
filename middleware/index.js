const Campground = require('../models/campground');
const Comment = require('../models/comment');


const middlewareObj = {};
//MIDDLEWARE - checks whether user own a campground or not

 middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if (req.isAuthenticated) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err && !foundCampground) {
                req.flash("error", "Campground not found");
                res.redirect("back")
            } else {
                //does user own campground
                if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                      next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back")
    }
}


 middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err && !foundComment) {
                req.flash("error", "comment not find")
                res.redirect("back")
            } else {
                //does user own campground
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin ) {
                      next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back")
    }
}

 middlewareObj.isLoggedIn = function(req,res, next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect('back')
    }
}

module.exports = middlewareObj;