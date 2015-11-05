var camera, scene, renderer
var controls, texts
var effect
var tmpColor, highlightedColor
var windowHalfX
var windowHalfY
var meshes = []
var mouse
var projector
var targetlist
var INTERSECTED
var intersects
var barORScatter //0=scatter, 1=bar
var hidecontrols




function init(){
  scene = new THREE.Scene();
  window.addEventListener( 'resize', onWindowResize, false );
  projector = new THREE.Projector();
  targetlist = [];
  highlightedColor = new THREE.Color( 0xf4412f);
  mouse = { x: 0, y: 0 };
  intersects = [];
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
}





// table selected, time to show columns.. See what kind of Visualization was chosen first
$("#TableList").change(function(){
	var visualSelected =  $("#VisualList option:selected").val();
	console.log(visualSelected);
	switch(visualSelected){
		case 'bar':
		case 'scatter':
			var tableSelected = $("#TableList option:selected").val();
			var getColumnTypeQuery = "SELECT column_name ,data_type FROM information_schema.columns where table_name = '";
			getColumnTypeQuery = getColumnTypeQuery.concat(tableSelected + "'");
			console.log(getColumnTypeQuery);

			$("#columnSelection.off-canvas-submenu").html("");
			$.getJSON('/retrieveData', { myQuery : getColumnTypeQuery }, function(data){
				// create a dropdown list

				// default at "Choose Column" to make sure user actually chooses a column
				var htmlStr = "<option value='' selected='selected' disabled='disabled'> Choose Column </option>";


				// populate dropdown list with columnNames and Values
				for (var i = 0; i < data.length; i++){
					htmlStr = htmlStr.concat('<option value="' + data[i].data_type + '">' + data[i].column_name + '</option>');
				}


				//$.each(data, function(j, g){

				//});
				htmlStr = htmlStr.concat('</select></li>');
				$("#columnSelection.off-canvas-submenu").append('<li>X: <select id="x">' + htmlStr);
				$("#columnSelection.off-canvas-submenu").append('<li>Y: <select id="y">' + htmlStr);
				$("#columnSelection.off-canvas-submenu").append('<li>Z: <select id="z">' + htmlStr);

				generateBarFilters();

			});
			break;
		default:
			alert("Please choose a Visualization");
			$("#TableList").val('');	// set it back to default
			break;


	}


});

$("#TableList").change(function(){

});

/*
$(function() {
	$( "#sliderX" ).slider({
	range: true,
	min: 0,
	max: 500,
	values: [ 75, 300 ],
	slide: function( event, ui ) {
		$( "#amountX" ).val(  ui.values[ 0 ] + " - " + ui.values[ 1 ] );
	}

	});
	$( "#amountX" ).val(  $( "#sliderX" ).slider( "values", 0 ) + " - " + $( "#sliderX" ).slider( "values", 1 ) );


});

$(function(){
	$( "#sliderY" ).slider({
	range: true,
	min: 0,
	max: 500,
	values: [ 75, 300 ],
	slide: function( event, ui ) {
		$( "#amountY" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
	}

	});

	$( "#amountY" ).val( "$" + $( "#sliderY" ).slider( "values", 0 ) + " - $" + $( "#sliderY" ).slider( "values", 1 ) );


});

$(function(){
	$( "#sliderZ" ).slider({
	range: true,
	min: 0,
	max: 500,
	values: [ 75, 300 ],
	slide: function( event, ui ) {
		$( "#amountZ" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
	}

	});

	$( "#amountZ" ).val( "$" + $( "#sliderZ" ).slider( "values", 0 ) + " - $" + $( "#sliderZ" ).slider( "values", 1 ) );


});
*/

function displayVisuals() {
	var dropDownSelected = $("#VisualList option:selected").val();
	var tableSelected = $("#TableList option:selected").val();


}

$("#xfrom").change(function(){
	console.log("fuck you");
});


// filters only for bar and scatter
function generateBarFilters(){

	var xCol = $("#x option:selected").text();
  	var yCol = $("#y option:selected").text();
  	var zCol = $("#z option:selected").text();
  	var tableSelected = $("#TableList option:selected").val();


  	var getMinMaxQuery = 'select max(' + xCol + '), min(' + xCol + ') FROM ' + tableSelected;
  	console.log(getMinMaxQuery);
/*
	$.getJSON('/retrieveData', { myQuery : getColumnTypeQuery }, function(data){
		test = data;
		renderData(data);
  	});*/
	// setting slider X
	console.log("Setting slider X");
  	$( "#sliderX" ).slider({
	range: true,
	min: 0,
	max: 500,
	values: [ 75, 300 ],
	slide: function( event, ui ) {
		$( "#amountX" ).val(  ui.values[ 0 ] + " - " + ui.values[ 1 ] );
	}

	});
	$( "#amountX" ).val(  $( "#sliderX" ).slider( "values", 0 ) + " - " + $( "#sliderX" ).slider( "values", 1 ) );



	$( "#sliderY" ).slider({
	range: true,
	min: 0,
	max: 1000,
	values: [ 75, 400 ],
	slide: function( event, ui ) {
		$( "#amountY" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
	}

	});

	$( "#amountY" ).val( "$" + $( "#sliderY" ).slider( "values", 0 ) + " - $" + $( "#sliderY" ).slider( "values", 1 ) );

	$( "#sliderZ" ).slider({
	range: true,
	min: 0,
	max: 500,
	values: [ 75, 300 ],
	slide: function( event, ui ) {
		$( "#amountZ" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
	}

	});

	$( "#amountZ" ).val( "$" + $( "#sliderZ" ).slider( "values", 0 ) + " - $" + $( "#sliderZ" ).slider( "values", 1 ) );


	//Columns for X

	//$("#filters.off-canvas-submenu").html("");

	//$("#filters.off-canvas-submenu").append('<li><input type="text" id="amount" readonly style="border:0; color:#f6931f; font-weight:bold;"></li>');
	//$("#filters.off-canvas-submenu").append('<li><div id="sliderX"></div></li>');




	/*
	//$("#filters.off-canvas-submenu").append('<li> X: ');
	$("#filters.off-canvas-submenu").append('<li>From: <input type="text" id="xfrom"></input></li>');
	$("#filters.off-canvas-submenu").append('<li>To: <input type="text" id="xto"></input></li>');
	//$("#filters.off-canvas-submenu").append("</li>");
	//Columns for Y

	//$("#filters.off-canvas-submenu").append('<li> Y: ');
	$("#filters.off-canvas-submenu").append('<li>From: <input type="text" id="yfrom"</input></li>');
	$("#filters.off-canvas-submenu").append('<li>To: <input type="text" id="yto"></input></li>');
	//$("#filters.off-canvas-submenu").append("</li>");

	//Columns for Z
	//$("#filters.off-canvas-submenu").append('<li> Z: ');
	$("#filters.off-canvas-submenu").append('<li>From: <input type="text" id="zfrom"></input></li>');
	$("#filters.off-canvas-submenu").append('<li>To: <input type="text" id="zto"</input></li>');
	//$("#filters.off-canvas-submenu").append("</li>");
	*/
}



function generateBar(){
  clearmeshes();

  init();
  initbars();
  animate();

  var tableSelected = $("#TableList option:selected").val();
  var x = $("#x option:selected").text();
  var y = $("#y option:selected").text();
  var z = $("#z option:selected").text();

  var xType = $("#x option:selected").val();
  var yType = $("#y option:selected").val();
  var zType = $("#z option:selected").val();

  var tempFrom;
  var tempTo;


  console.log(xType);
  console.log(yType);
  console.log(zType);

  // start of query
  var getColumnTypeQuery = "SELECT " + x + ", " + y + ", " + z + " from " + tableSelected;


  // handle X Column Filter
  /*switch (xType){
  	case "double precision":
  		tempFrom = $("#xfrom").val();
	  	tempTo = $("#xto").val()
	  	if(tempFrom!="")
	  	 	getColumnTypeQuery = getColumnTypeQuery.concat(" where x >= " + tempFrom);
	  	if(tempTo!="")
	  		getColumnTypeQuery = getColumnTypeQuery.concat("and x <= " + tempTo);
	 	break;

	case "text":
		break;

	case "date":
		break;
	default:
		console.log("should never happen");


  }*/



  if (xType == 'double precision'){
  	tempFrom = $("#xfrom").val();
  	tempTo = $("#xto").val()
  	if(tempFrom!="")
  	 	getColumnTypeQuery = getColumnTypeQuery.concat(" where x >= " + tempFrom);
  	if(tempTo!="")
  		getColumnTypeQuery = getColumnTypeQuery.concat(" and x <= " + tempTo);
  }

  if (yType == 'double precision'){
  	tempFrom = $("#yfrom").val();
  	tempTo = $("#yto").val()
  	if(tempFrom!="")
  	 	getColumnTypeQuery = getColumnTypeQuery.concat(" and y >= " + tempFrom);
  	if(tempTo!="")
  		getColumnTypeQuery = getColumnTypeQuery.concat(" and y <= " + tempTo);
  }

  if (zType == 'double precision'){
	tempFrom = $("#zfrom").val();
  	tempTo = $("#zto").val()
  	if(tempFrom!="")
  	 	getColumnTypeQuery = getColumnTypeQuery.concat(" and z >= " + tempFrom);
  	if(tempTo!="")
  		getColumnTypeQuery = getColumnTypeQuery.concat(" and z <= " + tempTo);
  }



  console.log(getColumnTypeQuery);
  var test;
  $.getJSON('/retrieveData', { myQuery : getColumnTypeQuery }, function(data){
	test = data;
	renderData(data);
  });

}

//Xinglun Xu add generateScatter function here
function generateScatter()
{
	barORScatter = 0;
	clearmeshes();
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 10000 );
	renderer = new THREE.WebGLRenderer({alpha:true});

	//add effect
  	effect = new THREE.StereoEffect(renderer);
  	effect.setSize( window.innerWidth, window.innerHeight );

  	//highlight part
  	highlightedColor = new THREE.Color( 0xf4412f);

  	//projector
  	projector = new THREE.Projector();
  	targetlist = [];
  	mouse = { x: 0, y: 0 };
  	intersects = [];
  	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	texts = [];
	setupScene();
	var geometry = new THREE.SphereGeometry( 0.25, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	var normalMaterial = new THREE.MeshNormalMaterial();
	$('.visual').append( renderer.domElement );
	var tableSelected = $("#TableList option:selected").val();
	var x = $("#x option:selected").text();
	var y = $("#y option:selected").text();
	var z = $("#z option:selected").text();
	var getColumnTypeQuery = "SELECT " + x + ", " + y + ", " + z + " from " + tableSelected;
	console.log(getColumnTypeQuery);
	// console.log("generateScatter: "+x+" "+y+" "+z);
	$.getJSON('/retrieveData', { myQuery : getColumnTypeQuery }, function(data){
		test = data;
		displayNodes(data, geometry, material, x, y, z);
	});
	drawNumbers(new THREE.Vector3(0,5.1, 0), new THREE.Vector3(1,0,0), 1, 7, texts);
	drawText(x, 6,0,0,texts);
	drawText(y, 0,6,0,texts);
	drawText(z, 0,0,6,texts);
	window.addEventListener( 'resize', onWindowResize, false );

	renderScatter();
	// console.log("generateScatter is called");
}


function generateBar(){
	barORScatter = 1;
  clearmeshes();
	generateBarFilters();

  init();
  initbars();
  animate();

  var tableSelected = $("#TableList option:selected").val();
  var x = $("#x option:selected").text();
  var y = $("#y option:selected").text();
  var z = $("#z option:selected").text();

  var getColumnTypeQuery = "SELECT " + x + ", " + y + ", " + z + " from " + tableSelected;
  console.log(getColumnTypeQuery);
  var test;
  $.getJSON('/retrieveData', { myQuery : getColumnTypeQuery }, function(data){
	test = data;
	renderData(data);
  });
}
function clearmeshes() {
  for (var i = 0; i < meshes.length; i++) {
	scene.remove(meshes[i]);
  }
  meshes = [];
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	effect.setSize( window.innerWidth, window.innerHeight );

}


function onDocumentMouseMove( event ) //http://www.moczys.com/webGL/Experiment_02_V05.html
{
	// the following line would stop any other event handler from firing
	// (such as the mouse's TrackballControls)
	//event.preventDefault();

	// update the mouse variable
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	//checkHighlight();
}


function checkHighlight(){ //http://www.moczys.com/webGL/Experiment_02_V05.html
	// find intersections

	// create a Ray with origin at the mouse position
	//   and direction into the scene (camera direction)
	var vector = new THREE.Vector3( mouse.x, mouse.y, 0.1 );
	//projector.unprojectVector( vector, camera );
	vector.unproject( camera );
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	// create an array containing all objects in the scene with which the ray intersects
	intersects = ray.intersectObjects( targetlist , false);

	if ( intersects.length > 0 )
	{	// case if mouse is not currently over an object
		if(INTERSECTED==null){
			INTERSECTED = intersects[ 0 ];
			tmpColor = INTERSECTED.object.material.color;
			INTERSECTED.object.material.color = highlightedColor;
		}
		else{	// if thse mouse is over an object
			INTERSECTED.object.material.color= tmpColor;
			INTERSECTED.object.geometry.colorsNeedUpdate=true;
			INTERSECTED = intersects[ 0 ];
			tmpColor = INTERSECTED.object.material.color;
			INTERSECTED.object.material.color = highlightedColor;
		}
		INTERSECTED.object.geometry.colorsNeedUpdate=true;

	}
	else // there are no intersections
	{
		// restore previous intersection object (if it exists) to its original color
		if ( INTERSECTED ){
			INTERSECTED.object.material.color = tmpColor;
			INTERSECTED.object.geometry.colorsNeedUpdate=true;
		}
		// remove previous intersection object reference
		//     by setting current intersection object to "nothing"

		INTERSECTED = null;

	}
}

function fetchData(){

}
