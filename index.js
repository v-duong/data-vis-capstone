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
var db = require('./database.js')
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://uiruphueqmgtzy:MeDPu8elxoLOYZFhSP6JstEQGU@ec2-54-225-195-249.compute-1.amazonaws.com:5432/d4bm6q4qc2ha09', {
   dialectOptions: {
        ssl: true
    },
    define: {
      schema: "useraccount"
    }
  });
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


app.get('/tables', function(req,res) {
  var schemaName = 'public';
  if (req.user)
    schemaName = 'u'+req.user.id;
  //var getTableQuery = "SELECT table_name FROM information_schema.tables WHERE table_schema = '"+schemaName+"' and table_name!='"+ schemaName+ "tablevistype'";
  var getTableQuery = "SELECT * FROM " + schemaName + "." + schemaName + "tablevistype";
  console.log(getTableQuery);

  db.queryDB(getTableQuery, function(myTables) {
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
  src.pipe(process.stdout);

  src.on('data', function(fileData) {

    textBuff = textBuff.concat(fileData.toString());

  });

    // uploaded successfully
    src.on('end', function() {
      // add textBuff into DB

      //console.log(textBuff);
      var schemaName = 'public';
      if (req.user)
        schemaName = 'u' + req.user.id;
      db.insertTable(req.file.originalname, schemaName ,textBuff, function(myRows) {

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
  // }
});


app.get('/tableforvis', function(req, res){
  schemaName = 'public';
  if (req.user) {
    schemaName = 'u' + req.user.id;
  }
  var vistype = req.query.visual;
  if ((vistype == 'bar') || (vistype == 'scatter'))
    vistype = 'barscatter';
  var getTableQuery = "SELECT tablename FROM " + schemaName + "." + schemaName + "tablevistype where vistype='" + vistype + "' OR vistype='All'";
  db.queryDB(getTableQuery, function(myRows) {
    if (myRows == null) {
      console.log("Couldnt access database");
    } else {
      res.send(JSON.stringify(myRows));
    }
  });
});



app.get('/visualize', function(req, res) {
  var tlist;
  var schemaName = 'public';
  //var a = ""
  if (req.user) {
    schemaName = 'u' + req.user.id;
    //a = ""
  }
  var getTableQuery = "SELECT * FROM " + schemaName + "." + schemaName + "tablevistype where vistype='All'";
  //db.queryDB("SELECT table_name FROM information_schema.tables WHERE table_schema = '"+ schemaName + "' " + a + ";",
  db.queryDB(getTableQuery, function(tlist) {
    res.render('visualize', {
      tables: tlist
    });
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

function generateQuery(schemaName, tableName, colList, filterQuery){

  if ( ((tableName == null) || (tableName == undefined))
      && ((colList == null) || (colList == undefined)) )
      return '';

  var query = 'SELECT ';

  for (var i = 0; i < colList.length-1; i++){
    query = query.concat(colList[i] + ', ');
  }
  query = query.concat(colList[colList.length-1] + ' FROM ' + schemaName + '.'+tableName);

  console.log(query);
  if ( (filterQuery == null) || (filterQuery == undefined) )
    return query;
  else {
    query = query.concat(' WHERE ' + filterQuery);
    return query;
  }

}

app.post('/createTableVisType', function(req, res){
  var schemaName = 'public';
  if (req.user)
    schemaName = 'u' + req.user.id;

  var createTableQuery = 'CREATE TABLE ' + schemaName + '.' + schemaName + 'tablevistype {tablename TEXT, vistype TEXT}';
  db.queryDB(createTableQuery, function(myRows){

  });

});


app.post('/updateTableVisType', function(req, res){
  var tableName = req.body.tableName;
  var visType = req.body.vistype;
  var schemaName = 'public';
  if (req.user)
    schemaName = 'u' + req.user.id;

  var delQuery = 'delete from ' + schemaName + '.' + schemaName + "tablevistype where tablename='" + tableName.toLowerCase() + "'";
  console.log("delQuery: " + delQuery );
  // remove the entry, if it even exist
  db.queryDB(delQuery, function(myRows){
      var updateRowQuery = 'INSERT INTO ' + schemaName + '.' + schemaName +  "tablevistype VALUES ('" + tableName.toLowerCase()  + "', '" + visType + "')";
      console.log("updateRowQuery: " + updateRowQuery );
      // insert updated Row
      db.queryDB(updateRowQuery, function(myRows){

      });

  });

});

app.get('/retrieveDistinctColValues', function(req, res){
  var colName = req.query.columnName;
  var tableName = req.query.tableName;
  var schemaName = 'public';
  if (req.user)
    schemaName = 'u'+req.user.id;
  var myQuery = 'select distinct ' + colName + ' from ' + schemaName + '.' + tableName.toLowerCase()  + ' where ' + colName + ' is not null order by ' + colName;

  console.log(myQuery);
  db.queryDB(myQuery, function(myRows) {
    if (myRows == null) {
      console.log("Couldnt access database");
    } else {

      res.send(JSON.stringify(myRows));
    }
  });
});

app.get('/retrieveColumns', function(req, res) {
  var myQuery = 'select column_name, data_type from information_schema.columns where ';
  var tableName = req.query.tableName;
  var dataTypes = req.query.dataType;
  var schemaName = 'public';
  if (req.user)
    schemaName = 'u'+req.user.id;
  myQuery = myQuery.concat("table_schema = '" + schemaName + "'" + " AND table_name = '" + tableName.toLowerCase() + "'" );

  if ((dataTypes != null) || (dataTypes != undefined)){
    myQuery = myQuery.concat(" AND (");
    for (var i = 0; i < dataTypes.length-1; i++){
      myQuery = myQuery.concat("data_type = '" + dataTypes[i] + "' OR ");
    }
    myQuery = myQuery.concat("data_type = '" + dataTypes[dataTypes.length-1] + "')");
  }

  console.log(myQuery);


  db.queryDB(myQuery, function(myRows) {
    if (myRows == null) {
      console.log("Couldnt access database");
    } else {

      res.send(JSON.stringify(myRows));
    }
  });
});

app.get('/retrieveData', function(req, res) {
  //var myQuery = req.query.myQuery;
  var tableName = (req.query.tableName).toLowerCase() ;
  var colList = req.query.columnList;
  var filterQuery = req.query.filterQuery;
  var orderBy = req.query.orderBy;

  var schemaName = 'public';
  if (req.user)
    schemaName = 'u'+req.user.id;

  var myQuery = generateQuery(schemaName, tableName , colList, filterQuery);
  if (myQuery == '')
    return;

  console.log("orderby "+orderBy);

  if(orderBy != null && orderBy != undefined) { myQuery += orderBy;}

  db.queryDB(myQuery, function(myRows) {
    if (myRows == null) {
      console.log("Couldnt access database");
    } else {

      res.send(JSON.stringify(myRows));
    }
  });
});

app.post('/delData', function(req, res) {
  var schemaName = 'public';
  if (req.user)
    schemaName = 'u'+req.user.id;
  var tableName = (req.body.tName).toLowerCase();

  var dropSuccess = false;
  db.deleteTable(tableName,schemaName, function(dropErr) {
    res.send(JSON.stringify(dropErr));
  });

});




var server = require('http').createServer(app);
server.listen((process.env.PORT || app.get('port')), function() {
  console.log("Express server listening on port %d ", server.address().port);
});
