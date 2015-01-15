var express = require('express')
var app = express();

app.set('port', (process.env.PORT || 8080))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
	//console.log("request");
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

		var db = new Db('test', new Server('localhost', 27017));
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
		      assert.equal(null, err);
		      assert.equal('world_no_safe', item.hello);
		      db.close();
		    })
		  }, 100);
		}
		});

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

//login route
app.post('/login', function (req, res) {
  var post = req.body;
  if (post.user === 'john' && post.password === 'johnspassword') {
    req.session.user_id = johns_user_id_here;
    res.redirect('/my_secret_page');
  } else {
    res.send('Bad user/pass');
  }
});

//logout route
app.get('/logout', function (req, res) {
  delete req.session.user_id;
  res.redirect('/login');
});  

//example
app.get('/my_secret_page', checkAuth, function (req, res) {
  res.send('if you are viewing this page it means you are logged in');
});
