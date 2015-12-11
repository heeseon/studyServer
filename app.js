var http = require('http'),
    express = require('express');
var bodyParser = require('body-parser');



var port = 7000;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


var server = http.createServer(app).listen(port, function(){
  console.log("Http server listening on port " + port);
});



app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.write('<h3>Welcome</h3>');
    res.write('<a href="/login">Please login</a>');
    res.end();
});

app.get('/login', function (req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form method="POST" action="/login">');
    res.write('<label name="userId">UserId : </label>')
    res.write('<input type="text" name="userId"><br/>');
    res.write('<label name="password">Password : </label>')
    res.write('<input type="password" name="password"><br/>');
    res.write('<input type="submit" name="login" value="Login">');
    res.write('</form>');

    res.end();
})

app.post('/login', function (req, res){
    var userId = req.param("userId");
    var password = req.param("password")


    var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

    // Connection URL
    var url = 'mongodb://localhost:27017/myproject';
    // Use connect method to connect to the Server

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
  
        console.log("Connected correctly to server");


        db.collection('users').find({id:userId}).toArray(function(err,docs) {
            if (err) throw err;
            //res.send(docs);

            if(docs.length == 0){
                console.log("there is no such a person");

                db.collection('users').insert([{id:userId, passwd:password}],function(err,doc){
                    if (err) {
                        throw err;

                    }//
    
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write('Thank you, '+userId+', you are guest. so you are added');
                    res.write('<p><a href="/"> back home</a>');
                    res.end();
                    db.close(); 
                });

            }
            else if(docs.length > 0){
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write('Thank you, '+userId+', you are already added. password is '+docs[0].passwd+'' );
                res.write('<p><a href="/"> back home</a>');
                res.end();
                db.close();  
            }
            else {

                db.close();
            }

            //db.close();
        });

    });

});
