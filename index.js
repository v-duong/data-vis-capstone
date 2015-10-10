var express = require('express');
var request = require('request');
var bodyParser = require('body-parser')
var app = express();
//var _ = require('underscore');
// var mysql =  require('mysql');
// var connection =  mysql.createConnection({
//     host : "localhost",
//     user : "root",
//     password: "",
//   }); 

// // make sure DB is available to connect
// connection.connect(function(err){
//   // unable to connect to DB.. Continue W.o DB  
//   if (err){
//     console.log("DB Error");
//   }
//   // able to connect to DB, start query
//   else {
//     console.log("DB Good to Go");
//     connection.query("use healthmessagesexchange4");
//     var strQuery = "select MsgId, Last_Accessed, patientId, GivenName, FamilyName, BirthTime from messages where patientId > 12530;"; 

//     connection.query( strQuery, function(err, rows){
//       if(err) {
//         throw err;
        
        
//       }else{
//         console.log( rows );
//       }
//     });
//   }
// });

var pg = require ('pg');
//connect to local postgres database
//var connectionString = 'postgres://localhost:5432/planeroutes';

// connect to heroku's database
var connectionString = "postgres://aaojwaabmvczuq:aHR5JA0-K0wmk6Q6k6VXXfhChO@ec2-54-197-241-239.compute-1.amazonaws.com:5432/d3so15mog50g7o";


var client = new pg.Client(connectionString);
client.connect(function(err){
  if (err){
    app.locals.dbClient = null;
    console.log("DB ERROR");
    console.log("Set dbClient to NULL")
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
  userg = req.query.username;
  res.render('index', { title: "TITLE", headertext: userg});
  console.log(userg + ' 1');
});

app.get('/showList',function(req, res){  
    
  if (client == null)
    console.log("Why!??!");
  else {
    
  //  var query = client.query("SELECT * FROM firstTable");
   // query.on('row', function(row) {
  //    console.log(row);
  //  });
   // query.on('end', client.end.bind(client)); //disconnect client manually


    

    client.query("SELECT * FROM firstTable", function(err, rows){
      if (err){
        console.log("DB FAILED");
      }
      else{
        var currentRow;  
        for (var i in rows.rows){
          currentRow = rows.rows[i];
          console.log(currentRow);
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

// app.get('/showList',function(req, res){  
//     res.render('showList', { 
//         title: 'showing list'
//         , fs: { loadTable : function(){
//             if (client == null)
//               console.log("Why!??!");
//             var query = client.query("SELECT * FROM firstTable");
//             query.on("row", function (row, result) {
//             //result.addRow(row);
            
//           });
//         }}
//     });

// });


app.listen(app.get('port'), function(){
  console.log('app now running on port', app.get('port'))
});