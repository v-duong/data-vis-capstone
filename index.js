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

// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use(bodyParser.json());

//app.use(express.json());
//app.use(express.urlencoded());

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
  //res.end();




});




app.get('/uploadPage', function(req, res){

  console.log("hi");
  res.render('uploadPage.jade');
  //res.end();
});



var file_uploaded = multer({ dest: 'public_files/' })
var uploadtype = file_uploaded.single('displayImage');
app.post('/file-upload', uploadtype, function(req, res, next){
  var tmp_path = req.file.path;

  /** The original name of the uploaded file
      stored in the variable "originalname". **/
  var target_path = 'public_files/' + req.file.originalname;
  
  /** Uploading the file. **/
 
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  var textBuff;
  src.on('open', function () {
    // This just pipes the read stream to the response object (which goes to the client)
    //src.pipe(res);
    //console.log(textBuff);
    //console.log(res.file);
  });

  src.on('data', function(fileData){
    textBuff = fileData.toString();

  });

  src.pipe(dest);
 
  // uploaded successfully
  src.on('end', function() { 
    console.log("File Loading Complete!");
    res.render('uploadPage', {
        "fileData" : textBuff
      });
  });


  // failed to upload 
  src.on('error', function(err) { res.render('back'); });
});

/*
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/file-upload', function(req, res) {
    //console.log(req.body);
    //console.log(req.files);
    var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/public_files/' + filename);  
            file.pipe(fstream); // POST data to the file
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                
                  
                console.log(req.files.thumbnail.size);
                //res.redirect('back');           //where to go next
            });
        });

        req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
          console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        });
}); */



app.listen(app.get('port'), function(){
  console.log('app now running on port', app.get('port'))
});
