var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dbConfig = require('./db');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(dbConfig.url);

var app = express();
var connection_string = '127.0.0.1:27017/versionOne';
var passport = require('passport');
var expressSession = require('express-session');
var router = express.Router();

app.set('port', (process.env.PORT || 8080))
app.use(express.static(__dirname + '/public'))

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({
  secret: 'snapGur',
  resave: false,
  saveUninitialized: true
}));
app.use(expressSession({secret: 'snapGur'}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;

app.get('/', function(request, response) {
    //console.log("request");
    /*
        var Db = require('mongodb').Db,
            MongoClient = require('mongodb').MongoClient,
            Server = require('mongodb').Server,
            ReplSetServers = require('mongodb').ReplSetServers,
            ObjectID = require('mongodb').ObjectID,
            Binary = require('mongodb').Binary,
            GridStore = require('mongodb').GridStore,
            Grid = require('mongodb').Grid,
            Code = require('mongodb').Code,
            BSON = require('mongodb').pure().BSON,
            assert = require('assert');

        var db = new Db('versionOne', new Server('localhost', 27017));
        // Fetch a collection to insert document into
        db.open(function(err, db) {

        if (err) {
            console.log(err);
        }
    else{
          var collection = db.collection("simple_document_insert_collection_no_safe");
          // Insert a single document
          //collection.insert({hello:'world_no_safe'});

          // Wait for a second before finishing up, to ensure we have written the item to disk
          setTimeout(function() {

            // Fetch the document
            collection.findOne({hello:'world_no_safe'}, function(err, item) {
                console.log(item);
              db.close();
            })
          }, 100);
        }
        });
*/
        var mongojs = require('mongojs');
        var db = mongojs(connection_string);
        var collection = db.collection("simple_document_insert_collection_no_safe");
        setTimeout(function() {

            // Fetch the document
            collection.findOne({hello:'world_no_safe'}, function(err, item) {
                console.log(item);
              db.close();
            })
          }, 100);

  //response.send('Hello World!')
  response.sendFile('public/frontpage.html', {root: __dirname });
})

app.get('/login.html', function(request, response) {
    respone.sendFile('public/login.html');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

//Authorization functions
function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page');
  } else {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  }
}

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

 app.get('/', function(req, res) {
        // Display the Login page with any flash message, if any
        res.render('index', { message: req.flash('message') });
    });

    /* Handle Login POST */
     app.post('/login', passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login.html',
        failureFlash : true  
    }));

    /* GET Registration Page */
     app.get('/signup', function(req, res){
        res.render('register',{message: req.flash('message')});
    });

    /* Handle Registration POST */
     app.post('/signup', passport.authenticate('signup', {
        successRedirect: '/',
        failureRedirect: '/klsk',
        failureFlash : true  
    }));

    /* Handle Logout */
     app.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

//example
app.get('/my_secret_page', checkAuth, function (req, res) {
  res.send('if you are viewing this page it means you are logged in');
});
