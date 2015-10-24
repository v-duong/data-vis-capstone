var express = require('express');
var app = express();
var fs = require('fs');
var multer = require('multer');

app.set('port', (process.env.PORT || 4500));

app.set('views', 'views')
app.set('view engine', 'jade');
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
    cb(null, 'public_files/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname );
  }
})


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
  res.render('scatter', { title: "scatter"});
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
  
  res.render('displayData.jade');
});



app.get('/retrieveData', function(req, res){
    //var tableName = req.query.tableName;

    var myQuery = req.query.myQuery;
    console.log(myQuery);
    var myDB = require('./public/js/database.js');
    //console.log(tableName);
    //var myQuery = "select * from ";
    //myQuery = myQuery.concat(tableName);
    myDB.queryDB(myQuery, function(myRows){
      if (myRows == null){
        console.log("Couldnt access database");
      }
      else{
        console.log(JSON.stringify(myRows));
       res.send(JSON.stringify(myRows)); 
      }

    });
    
});

 //select * from planeinfo ORDER BY (substring(manufacturer_model, '^[0-9]+'))::int, substring(manufacturer_model, '[^0-9_].*$');


app.post('/deleteData', function(req, res){
    var fileName = req.body.filters;
    var tableName = fileName.replace(/ /g, "_");
    tableName = tableName.substr(0, tableName.length-4);
    var myDB = require('./public/js/database.js');
    console.log(tableName);
    var dropSuccess;
    myDB.deleteTable(tableName, function(dropErr){
      dropSuccess = dropErr
    });

    // delete the physical file
    fs.unlinkSync('public_files/'.concat(fileName));
    res.send(JSON.stringify(true));
});



server.listen((process.env.PORT || app.get('port')), function(){
  console.log("Express server listening on port %d ", server.address().port);
});
