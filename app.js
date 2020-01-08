var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds"),
    passport    = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    flash       = require("connect-flash"),
    User          = require('./models/user')

    //requiring routes
var commentRoutes    = require("./routes/comments"), 
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

    // Connect to MongoDB
mongoose
  .connect(
    'mongodb://localhost:27017/test',
    { useNewUrlParser: true,
     useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());


app.use(require('express-session')({
  secret: 'this is my first fullstack',
  resave: false,
  saveUninitialized: false
}));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

seedDB();

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });

 app.use("/", indexRoutes);
 app.use("/campgrounds", campgroundRoutes);
 app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(8000, function(){
   console.log("The YelpCamp Server Has Started! at port 8000");
});