var express = require('express');
var request = require('request');
var bodyParser = require('body-parser')
var busboy = require('connect-busboy');
var app = express();
var path = require('path');
var fs = require('fs');
var multer = require('multer');


app.set('port', (process.env.PORT || 4500));

var userg = "init"

app.set('views', 'views')
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));



app.use(express.static('public'))


//Get values from Form:'TestJSON' and pass a JsonObject back to jade -- Newman
app.post('/',function(req,res)
  {
    var textInJsonFormat = {"first":req.body.text1, "second":req.body.text2, "third":req.body.text3};
    res.render("index", {Json:textInJsonFormat});
    res.end("yes");
  });

app.get('/', function (req, res) {
  res.render('index', { title: "TITLE"});
});



app.get('/showList',function(req, res){
  var myDB = require('./public/js/database.js');
  var myQuery = "select * from planeinfo where max_speed IS NOT NULL AND msrp IS NOT NULL";
  //var myRows = myDB.queryDB();
  //var myRows ;
  myDB.queryDB(myQuery, function(myRows){
    if (myRows == null){
     console.log("Couldnt access database");
    }

    else{
      console.log("Rendering");
      //console.log(myRows);
      res.render('showList', {
        "showList" : myRows
      });
    }

  });
 
});



app.get('/Uploaded_Files', function(req, res){
  var fileList = fs.readdirSync('public_files');
 fileList.splice(0,1);

  res.render('Uploaded_Files', {
    "showFiles" : fileList
  });
});




app.get('/uploadPage', function(req, res){

  res.render('uploadPage.jade');
  //res.end();
});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public_files/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname );
  }
})


var file_uploaded = multer({ storage: storage });

app.post('/file-upload', file_uploaded.single('displayImage'), function(req, res){
  var tmp_path = req.file.path;
  var target_path = 'public_files/' + req.file.originalname;
  var src = fs.createReadStream(tmp_path);
  src.on('data', function(fileData){
    // do the parsing and upload to DB here.. 

    textBuff = fileData.toString();
  });
    // uploaded successfully
  src.on('end', function() { 
    // remove src??
    console.log("File Loading Complete!");
  
    // add textBuff into DB
    var myDB = require('./public/js/database.js');
    myDB.insertTable(req.file.originalname, textBuff, function(myRows){
    
      if (myRows == true){
        console.log("insert success");
      }

      else{
        console.log("insert fail");  
      }

    });
    res.render('uploadPage', {
        "fileData" : textBuff
    });
    
  });
  // failed to upload 
  src.on('error', function(err) { res.render('back'); });
});




//var server = require('http').Server(app);
var server = require('http').createServer(app);
//var io = require('socket.io')(server);
//var io = require('socket.io').listen(server);
var io = require('socket.io').listen(server);




server.listen((process.env.PORT || app.get('port')), function(){
//server.listen(4501, function(){ 
  console.log("Express server listening on poart %d ", server.address().port);
});


io.sockets.on('connection', function(socket){
  console.log("inside connection");
  socket.on('deleteFile', function(fileName){
    //console.log("fileName: ");
    //console.log(fileName);
    var tableName = fileName.replace(/ /g, "_");
    tableName = tableName.substr(0, tableName.length-4);
    var myDB = require('./public/js/database.js');
    console.log(tableName);
    var dropSuccess;
    myDB.deleteTable(tableName, function(dropErr){
      dropSuccess = dropErr
    });

   
    fs.unlinkSync('public_files/'.concat(fileName));
    socket.emit('doneDelete', dropSuccess);
    
  });
});

/*
io.on('connection', function(socket){

  socket.on('deleteFile', function(fileName){
    //console.log("fileName: ");
    //console.log(fileName);
    var tableName = fileName.replace(/ /g, "_");
    tableName = tableName.substr(0, tableName.length-4);
    var myDB = require('./public/js/database.js');
    console.log(tableName);
    var dropSuccess;
    myDB.deleteTable(tableName, function(dropErr){
      dropSuccess = dropErr
    });

   
    fs.unlinkSync('public_files/'.concat(fileName));
    socket.emit('doneDelete', dropSuccess);
    
  });
});*/
/*
app.listen(app.get('port'), function(){
  console.log('app now running on port', app.get('port'))
});*/
