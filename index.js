var express = require('express');
var app = express();
var fs = require('fs');
var multer = require('multer');
var bodyParser = require('body-parser');



app.set('port', (process.env.PORT || 4500));

app.set('views', 'views');
app.set('view engine', 'jade');


app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));




// Database mapping
// csv validation

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
  var client = require('./public/js/database.js');
  var tlist;
  client.queryDB("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';" , function(tlist){
    res.render('index', { title: "TITLE", tables : tlist});
  });
});


app.get('/Uploaded_Files', function(req, res){
  //var fileList = fs.readdirSync('public_files');
  var getTableQuery = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'";
  var myDB = require('./public/js/database.js');
  myDB.queryDB(getTableQuery, function(myTables){
    if (myTables == null){
      console.log("uh oh");
    }
    else{

       res.render('Uploaded_Files', {
        "showFiles" : myTables
        });
    }

  });
  //fileList.splice(0,1);

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
  if (req.file == null){
     res.render('uploadPage', {
          "fileData" : "Please select a File"
      });
     return;
  }

  var tmp_path = req.file.path;
  var target_path = 'public_files/' + req.file.originalname;
  var src = fs.createReadStream(tmp_path);

  src.on('data', function(fileData){
    textBuff = fileData.toString();
  });
    // uploaded successfully
  src.on('end', function() {
    // add textBuff into DB
    var myDB = require('./public/js/database.js');

    myDB.insertTable(req.file.originalname, textBuff, function(myRows){

      if (myRows == true){
        console.log("insert success");
        // delete the physical file
        fs.unlinkSync(target_path);
        res.render('uploadPage', {
          "fileData" : textBuff
        });
        return;
      }
      else{
        console.log("insert fail");
        textBuff = "Upload Failed";
        res.render('uploadPage', {
          "fileData" : textBuff
        });
        return;
      }

    });


  });
  // failed to upload
  src.on('error', function(err) { res.render('back'); });
});


var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen((process.env.PORT || app.get('port')), function(){
  console.log("Express server listening on port %d ", server.address().port);
});



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
  res.render('displayData');
});




app.get('/retrieveData', function(req, res){
    var myQuery = req.query.myQuery;
    console.log(myQuery);
    var myDB = require('./public/js/database.js');
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



app.post('/delData', function(req, res){
    //console.log(req);
    console.log(req.body);
    var tableName = req.body.tName;
    //tableName = tableName.substr(0, tableName.length-4);
    var myDB = require('./public/js/database.js');
    console.log(tableName);
    var dropSuccess = false;
    myDB.deleteTable(tableName, function(dropErr){
      res.send(JSON.stringify(dropErr));
    });

});