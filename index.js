var express = require('express');
var session = require('express-session');
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var app = express();
var connection_string = '127.0.0.1:27017/versionOne';
var passport = require('passport');
var expressSession = require('express-session');
var router = express.Router();

app.set('port', (process.env.PORT || 8080))
app.use(express.static(__dirname + '/public'))

app.use(express.static('public'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'snapGur' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

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


router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/login.html',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

//example
app.get('/my_secret_page', checkAuth, function (req, res) {
  res.send('if you are viewing this page it means you are logged in');
});
