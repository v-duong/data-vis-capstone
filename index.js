var express = require('express');
var request = require('request');
var bodyParser = require('body-parser')
var busboy = require('connect-busboy');
var app = express();
var path = require('path');
var fs = require('fs');
var multer = require('multer');





var pg = require ('pg');
//connect to local postgres database
var connectionString = 'postgres://localhost:5432/capstone_data';

// connect to heroku's database
//var connectionString = "postgres://aaojwaabmvczuq:aHR5JA0-K0wmk6Q6k6VXXfhChO@ec2-54-197-241-239.compute-1.amazonaws.com:5432/d3so15mog50g7o";


var client = new pg.Client(connectionString);
client.connect(function(err){
  if (err){
    app.locals.dbClient = null;
    console.log("DB ERROR");
    //console.log("Set dbClient to NULL")
  }
  else {
    app.locals.dbClient = client;
  }

});





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

  if (client == null)
    console.log("Why!??!");
  else {

    //client.query("SELECT * FROM planeinfo", function(err, rows){
    client.query("select * from planeinfo where max_speed IS NOT NULL AND msrp IS NOT NULL" , function(err, rows){
      if (err){
        console.log("DB FAILED");
      }
      else{
        var currentRow;
        for (var i in rows.rows){
          currentRow = rows.rows[i];
          //console.log(currentRow);
        }
        //rows.rows.find({},{},function(e, docs){
          res.render('showList', {

            "showList" : rows.rows
          });
        //});

      }
    });
  }
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
    res.render('uploadPage', {
        "fileData" : textBuff
      });
  });


  // failed to upload 
  src.on('error', function(err) { res.render('back'); });
});





app.listen(app.get('port'), function(){
  console.log('app now running on port', app.get('port'))
});
