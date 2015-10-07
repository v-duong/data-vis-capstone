var express = require('express');
var request = require('request');
var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

var userg = "init"

app.set('views', 'views')
app.set('view engine', 'jade');

app.use(express.static('public'))

app.get('/', function (req, res) {
  userg = req.query.username;
  res.render('index', { title: "TITLE", headertext: userg});
  console.log(userg + ' 1');
});

var server = app.listen(3500, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});
