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
