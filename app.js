var http = require('http'),
    express = require('express');
var multer  = require('multer');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');



var port = 7000;
var done=false;
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var server = http.createServer(app).listen(port, function(){
  console.log("Http server listening on port " + port);
});


//var upload = multer({ dest: './uploads'});
//app.use(express.bodyParser({uploadDir:'./uploads'}));
var upload = multer({ dest: 'uploads/' });



app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.write('<h3>Welcome</h3>');
    res.write('<a href="/login">Please login</a>');
    res.end();
});

app.get('/login', function (req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form method="POST" action="/login">');
    res.write('<label name="userId">UserId : </label>');
    res.write('<input type="text" name="userId"><br/>');
    res.write('<label name="password">Password : </label>')
    res.write('<input type="password" name="password"><br/>');
    res.write('<input type="submit" name="login" value="Login">');
    res.write('</form>');

    res.end();
})


app.post('/upload/:id', upload.single('filefield'), function(req, res, next){
      /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
  var tmp_path = req.file.path;
  var userId = req.params.id;

  console.log("userId = " + userId + ", " + req.user);

  /** The original name of the uploaded file
      stored in the variable "originalname". **/
  var target_path = 'uploads/' + req.file.originalname;

  console.log("tmp_path = " +tmp_path +", "+ target_path +", "+ req.file+", "+ req.files);

  /** A better way to copy the uploaded file. **/
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);

  src.on('end', function() { 

        

        var MongoClient = require('mongodb').MongoClient
        , assert = require('assert');

        // Connection URL
        var url = 'mongodb://localhost:27017/myproject';
        // Use connect method to connect to the Server

        MongoClient.connect(url, function(err, db) {
                db.collection('images').insert([{id:userId, imagePath:target_path}],function(err,doc){
                    if (err) {
                        db.close();
                        throw err;

                    }//
    
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write('upload complete');
                    res.write('<p><a href="/"> back home</a>');
                    res.end();
                    db.close(); 
                });

        });


    //res.render('complete'); 

  });
  src.on('error', function(err) { 
        res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write('upload error');
                    res.write('<p><a href="/"> back home</a>');
                    res.end();
  });



});



app.post('/login', function (req, res){
    var userId = req.param("userId");
    var password = req.param("password");


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
                var obj={"userId":userId};
                res.render("uploadImage", obj);
                db.close();  
            }
            else {

                db.close();
            }

            //db.close();
        });

    });

});


app.post('/imageDisplay/:id', function (req, res){

    var MongoClient = require('mongodb').MongoClient
        , assert = require('assert');

    // Connection URL
    var url = 'mongodb://localhost:27017/myproject';
    // Use connect method to connect to the Server

    MongoClient.connect(url, function(err, db) {

      console.log("db connected....." + req.params.id);
      db.collection('images').find({id:req.params.id}).toArray(function(err,docs) {
            if (err) throw err;
            //res.send(docs);
            console.log("images......." + docs.length);

            res.writeHead(200, {'Content-Type': 'text/html'});
            if(docs.length > 0){
                for(var i =0 ; i < docs.length ; ++i)
                {
                    res.write('Thank you, '+docs[i].imagePath+'.');
                }
            }
            else {
              res.write('there is no images.....');
            }

            res.end();


            db.close();
      });


    });



});

