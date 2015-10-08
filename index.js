var express = require('express');
var request = require('request');
var app = express();

var mysql =  require('mysql');
var connection =  mysql.createConnection({
    host : "localhost",
    user : "root",
    password: "",
  }); 

connection.connect();
connection.query("use healthmessagesexchange4");
  var strQuery = "select MsgId, Last_Accessed, patientId, GivenName, FamilyName, BirthTime from messages where patientId > 12530;"; 
  
  connection.query( strQuery, function(err, rows){
    if(err) {
      //throw err;
      
    }else{
      console.log( rows );
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


app.listen(app.get('port'), function(){
  console.log('app now running on port', app.get('port'))
});