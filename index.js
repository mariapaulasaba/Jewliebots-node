var express = require('express')
  , fs = require('fs')
  , path = require('path')
  , connect = require('connect');

var app = express();

app.use(connect.bodyParser());
app.use(connect.cookieParser());

app.use('/', express.static(path.join(__dirname + '/views')));
app.use('/css', express.static(path.join(__dirname + '/views/css')));
app.use('/js', express.static(path.join(__dirname + '/views/js')));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);


//  "public" off of current is root

app.listen(process.env.PORT || 5000);

console.log('Listening on port 5000');

var filePath = {};

app.post('/file', function(req, res){
   console.log(req.body);
   filePath = req.body.fileName;
   res.contentType('json');
   fs.writeFile('./views'+filePath, req.body.code, function(){ 
   res.send({ some: JSON.stringify({response:'json'}) }); 
   });
});

app.get('/', function(req,res){
	res.sendfile(__dirname + '/views/index.html');
});

app.get('/bots', function(req, res){
    res.sendfile(__dirname + '/views/bots.html');
});

app.get('/botcode.ino', function(req, res) {  
		  console.log("Got request /botcode.ino: " + tweetscore);
		  res.send("" + tweetscore); // needs to be string for some reason?
});
