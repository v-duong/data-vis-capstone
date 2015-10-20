var express = require('express');
var app = express();

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');


var server = app.listen(3000, function() {
	console.log("listening on port %d", server.address().port);
});

app.get("/hello.html", function(req, res) {
	res.send("<!DOCTYPE html><html>Hello World!</html>");
});

app.get("/", function(req, res) {
	res.render('3d', {'pic1': input1, 'pic2': input2 })

});

// app.get('/', function(req, res) {
// 	res.render('index', {'title': 'Hey', 'message': 'Hello there!'})
// });

// function render() {
// 	background.render();
// 	requestAnimationFarme(render);

// }

// $(win).ready(function() {
// 	background.init($('#background'));
// 	render();
// });

// $(win).scroll(function() {
// 	background.update();
// });