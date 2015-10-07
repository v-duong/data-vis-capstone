var express = require('express');
var request = require('request');
var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}


app.set('views', 'views')
app.set('view engine', 'jade');

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.render('index', { title: "TITLE", headertext: "headertext"});
  var user = req.query.username;
  console.log(user + ' 1');
});

app.get('/?username=:username', function (req,res){
  var yolo = req.params.username;
  console.log(yolo + ' 2');
});

var server = app.listen(3500, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});
