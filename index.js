var exports = module.exports = {};
var express = require('express');
var app = express();
var fs = require('fs');
var multer = require('multer');
var bodyParser = require('body-parser')

app.set('port', (process.env.PORT || 4500));

app.set('views', 'views');
app.set('view engine', 'jade');
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//Get values from Form:'TestJSON' and pass a JsonObject back to jade -- Newman
var x = 0;
var y = 0;
var z = 0;

app.post('/',function(req,res)
  {
    x = req.body.X; y = req.body.Y; z = req.body.Z;
    res.redirect("/scatter");
    res.end("yes");
  });

app.get('/', function (req, res) {
  res.render('index', { title: "TITLE"});
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
});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public_files/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname );
  }
});


var file_uploaded = multer({ storage: storage });

app.post('/file-upload', file_uploaded.single('datafile'), function(req, res){
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
    console.log(textBuff);
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


var server = require('http').createServer(app);
var io = require('socket.io').listen(server);



app.get('/scatter',function(req,res){
  res.render('scatter', {title: 'scatter', data1:x, data2:y, data3:z});
})


app.get('/bars',function(req, res){
  var client = require('./public/js/database.js');
  if (client == null)
    console.log("Where is Client?");
  else {
    client.queryDB("select * from randnum" , function(myRows){
      if (myRows == null){
        console.log("Couldnt access database");
      }
      else{
        var currentRow;
        for (var i in myRows){
          currentRow = myRows[i];
        }
          res.render('bars', {
            _data : myRows
          });
      }
    });
  }
});



app.get('/displayData',function(req, res){
  var myDB = require('./public/js/database.js');
  var CurrentTableToDisplay = app.locals.context;
  console.log(CurrentTableToDisplay);
  var myQuery = "select * from ";
  myQuery = myQuery.concat(CurrentTableToDisplay);
  //var myRows = myDB.queryDB();
  //var myRows ;
  console.log(myQuery);
  myDB.queryDB(myQuery, function(myRows){
    if (myRows == null){
     console.log("Couldnt access database");
    }

    else{
      console.log("Rendering");
      //console.log(myRows);
      res.end();

    }
  });
});

app.post('/deleteData', function(req, res){
    var fileName = req.body.filters;
    var tableName = fileName.replace(/ /g, "_");
    tableName = tableName.substr(0, tableName.length-4);
    var myDB = require('./public/js/database.js');
    console.log(tableName);
    var dropSuccess;
    myDB.deleteTable(tableName, function(dropErr){
      dropSuccess = dropErr;
    });

    // delete the physical file
    fs.unlinkSync('public_files/'.concat(fileName));
    res.send(JSON.stringify(true));
});



server.listen((process.env.PORT || app.get('port')), function(){
  console.log("Express server listening on port %d ", server.address().port);
});
