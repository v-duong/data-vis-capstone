var express = require('express');
var app = express();
var fs = require('fs');
var multer = require('multer');
var bodyParser = require('body-parser');



app.set('port', (process.env.PORT || 4500));

app.set('views', 'views');
app.set('view engine', 'jade');


app.use('/static', express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/files', function(req, res) {
  res.render('files');
});

app.get('/about', function(req, res) {
  res.render('about');
});

app.get('/nba_visualize', function(req, res){
  res.render('nba_visualize');
});


app.get('/Uploaded_Files', function(req, res) {
  //var fileList = fs.readdirSync('public_files');
  var getTableQuery = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'";
  var myDB = require('./public/js/database.js');
  myDB.queryDB(getTableQuery, function(myTables) {
    if (myTables == null) {
      console.log("uh oh");
    } else {

      res.render('Uploaded_Files', {
        "showFiles": myTables
      });
    }

  });
  //fileList.splice(0,1);

});

app.get('/tables', function(req,res) {
  var getTableQuery = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'";
  var myDB = require('./public/js/database.js');
  myDB.queryDB(getTableQuery, function(myTables) {
    if (myTables == null)
      res.end("ERROR")
    else {
      res.end(JSON.stringify(myTables))
    }
  });
});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public_files/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});


var file_uploaded = multer({
  storage: storage
});

app.post('/files', file_uploaded.single('datafile'), function(req, res) {
  if (req.file == null) {
    return;
  }

  var tmp_path = req.file.path;
  var target_path = 'public_files/' + req.file.originalname;
  var textBuff = "";
  var src = fs.createReadStream(tmp_path);

  src.on('data', function(fileData) {
    textBuff = textBuff.concat(fileData.toString());
  });

  // uploaded successfully
  src.on('end', function() {
    // add textBuff into DB

    var myDB = require('./public/js/database.js');

    myDB.insertTable(req.file.originalname, textBuff, function(myRows) {

      if (myRows == true) {
        console.log("insert success");
        // delete the physical file

        res.render('files');

      } else {
        console.log("insert fail");
        textBuff = "Upload Failed";
        res.render('files');

      }
      fs.unlinkSync(target_path);

    });
  });
  src.on('error', function(err) {
    res.render('files');
  });

});

app.get('/scatter', function(req, res) {
  var client = require('./public/js/database.js');
  if (client == null)
    console.log("cannot get database");
  else {
    client.queryDB("select * from smartphonestestexcel", function(myRows) {
      if (myRows == null) {
        console.log("query fail");
      } else {
        res.render('scatter', {
          _data: myRows
        });
      }
    });
  }
});

app.get('/bars', function(req, res) {
  var client = require('./public/js/database.js');
  if (client == null)
    console.log("Where is Client?");
  else {
    client.queryDB("select * from randnum", function(myRows) {
      if (myRows == null) {
        console.log("Couldnt access database");
      } else {
        var currentRow;
        for (var i in myRows) {
          currentRow = myRows[i];
        }
        res.render('bars', {
          _data: myRows
        });
      }
    });
  }
});



app.get('/displayData', function(req, res) {
  res.render('displayData');
});

app.get('/visualize', function(req, res) {
  var client = require('./public/js/database.js');
  var tlist;
  client.queryDB("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';", function(tlist) {
    res.render('visualize', {
      tables: tlist
    });
  });
});

app.get('/retrieveData', function(req, res) {
  var myQuery = req.query.myQuery;
  var myDB = require('./public/js/database.js');
  myDB.queryDB(myQuery, function(myRows) {
    if (myRows == null) {
      console.log("Couldnt access database");
    } else {

      res.send(JSON.stringify(myRows));
    }
  });
});

app.post('/delData', function(req, res) {
  var tableName = req.body.tName;
  var myDB = require('./public/js/database.js');
  var dropSuccess = false;
  myDB.deleteTable(tableName, function(dropErr) {
    res.send(JSON.stringify(dropErr));
  });

});




var server = require('http').createServer(app);
server.listen((process.env.PORT || app.get('port')), function() {
  console.log("Express server listening on port %d ", server.address().port);
});
