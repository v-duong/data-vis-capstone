var express = require('express');
var app = express();

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static('public'));

var server = app.listen(3000, function() {
	console.log("listening on port %d", server.address().port);
});

app.get("/hello.html", function(req, res) {
	res.send("<!DOCTYPE html><html>Hello World!</html>");
});

app.get("/3dviews", function(req, res) {
	res.render('3dviews', {pic1: "pic2.jpg", pic2: "pic2.jpg" })
});

app.get("/sample", function(req, res) {
	res.render('sample', {"Source" : "js/three.min.js"})
});

app.get("/", function(req, res) {
	res.send("<!DOCTYPE html>\
		<html>\
		<body>\
		<img src= '"+ 'pic.jpeg' +"' alt='a' style='width:228px;height:228px;' >\
		<img src= '"+ 'https://cdn.chv.me/images/thumbnails/DIY_3D_Google_Cardboard_L2Jp8G8L.jpg.thumb_400x400.jpg' +"' alt='b' style='width:228px;height:228px;'>\
		</body>\
		</html>");
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