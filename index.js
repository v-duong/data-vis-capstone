var express = require('express');
var request = require('request');
var app = express();

var mysql =  require('mysql');
var connection =  mysql.createConnection({
    host : "localhost",
    user : "root",
    password: "",
  }); 

// make sure DB is available to connect
connection.connect(function(err){
  // unable to connect to DB.. Continue W.o DB  
  if (err){
    console.log("DB Error");
  }
  // able to connect to DB, start query
  else {
    console.log("DB Good to Go");
    connection.query("use healthmessagesexchange4");
    var strQuery = "select MsgId, Last_Accessed, patientId, GivenName, FamilyName, BirthTime from messages where patientId > 12530;"; 

    connection.query( strQuery, function(err, rows){
      if(err) {
        throw err;
        
        
      }else{
        console.log( rows );
      }
    });
  }
});



app.set('port', (process.env.PORT || 4500));

var userg = "init"

app.set('views', 'views')
app.set('view engine', 'jade');

app.use(express.static('public'))

app.get('/', function (req, res) {
  userg = req.query.username;
  res.render('index', { title: "TITLE", headertext: userg});
  console.log(userg + ' 1');
});

app.get('/showList', function (req, res) {
  res.render('showList', {
    title: 'showing List'
  });
});


app.listen(app.get('port'), function(){
  console.log('app now running on port', app.get('port'))
});