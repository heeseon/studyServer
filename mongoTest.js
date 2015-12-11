var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.collection('users').insert([{id:'heeseon'},{city:'busan'}],function(err,doc){
		if (err) throw err;
		
		db.collection('users').find({id:'heeseon'}).toArray(function(err,docs) {
       		if (err) throw err;
       		//res.send(docs);
       		for (i = 0; i < docs.length; i++) {
           		console.log(docs[i].id);
       		}

       		if(docs.length == 0){
           		console.log("there is no such a person");

       		}

       		db.close();
   		});


  	});

	
  	


  
});

