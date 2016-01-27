var express = require('express');
var app = express();
var fs = require('fs');
var multer = require('multer');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session')
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var flash = require("connect-flash");
var db = require('./public/js/database.js')
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://uiruphueqmgtzy:MeDPu8elxoLOYZFhSP6JstEQGU@ec2-54-225-195-249.compute-1.amazonaws.com:5432/d4bm6q4qc2ha09', {
   dialectOptions: {
        ssl: true
    }});
//TODO: MOVE DB URL SHIT TO CONFIG VAR

app.set('port', (process.env.PORT || 4500));

app.set('views', 'views');
app.set('view engine', 'jade');


app.use('/static', express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.use(cookieParser());
app.use(flash());
app.use(session({secret: 'secret as shit', resave: false, saveUninitialized: false, cookie: {expires: new Date(Date.now() + 2592000000)}}));
app.use(passport.initialize());
app.use(passport.session());

require('./passport.js')(passport, Strategy, bcrypt, sequelize);

app.get('*', function(req, res, next) {
  res.locals.logged = (req.user) ? true : false
  next();
})

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/login', function(req, res) {
    res.render('login', {message: req.flash('error')});
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

app.post('/auth/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash : true
}));

app.post('/auth/register', passport.authenticate('register', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash : true
}));

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
    }
    else {
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

  var visualType = req.body.visualType;

  var tmp_path = req.file.path;
  var target_path = 'public_files/' + req.file.originalname;
  var textBuff = "";
  var src = fs.createReadStream(tmp_path);

  //If globe radiobutton selected
  if (visualType == 1){
  var jsonFile = "";

  src.on('data', function(fileData) {
    jsonFile = jsonFile.concat(fileData.toString());
    // console.log(fileData.toString());
  });

  src.on('end', function() {

    jsonFile = jsonFile.slice(0,-1);
    jsonFile = jsonFile.split('\r\n');
    if(jsonFile.length==1){
      jsonFile = jsonFile.join().split('\r');
    }
    columns = jsonFile.splice(0,1)[0];

    //Check if there are not 3 columns (lat,long,magnitude)
    if (columns.split(',').length != 3){
      console.log("Invalid Globe Data");
      return;
    }

    var max = 0;
    var temp;
    var mag;
    for(var i in jsonFile){
      temp = jsonFile[i].split(",");
      mag = parseFloat(temp[2]);
      if(mag>max){max = mag;}
    }

    // console.log(max);

    name = req.file.originalname;
    name = name.substring(0, name.indexOf('.csv'));
    jsonFile = "[\"" + name + "\"," +max+",[" + jsonFile + "]]";

    var writer = fs.writeFile(__dirname + "/public/globeData/" + name + ".json", jsonFile, function(err){
        if (err){
          return console.log(err);
        }
        console.log("Saved");
        res.render('files');

      });

    });

  src.on('error', function(err) {
    res.render('files');
  });

  //If general data type radio button selected
  } else if (visualType == 0){

  src.on('data', function(fileData) {
    textBuff = textBuff.concat(fileData.toString());
  });

    // uploaded successfully
    src.on('end', function() {
      // add textBuff into DB

      var myDB = require('./public/js/database.js');
      //console.log(textBuff);
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
  }
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

app.get('/globe_visualize', function(req, res){
  var client = require('./public/js/database.js');
  var tlist = getFiles(__dirname + '/public/globeData');
  //Removes .json from fileNames
  for (i = 0; i < tlist.length; i++){
    tlist[i] = tlist[i].substring(0, tlist[i].length-5);
  }
  res.render('globe_visualize', {
      tables: tlist
    });
});

//Returns list of files from a directory
function getFiles(dir){
    fileList = [];

    var files = fs.readdirSync(dir);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var name = dir+'/'+files[i];
        if (!fs.statSync(name).isDirectory()){
            fileList.push(files[i]);
        }
    }
    return fileList;
}

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
