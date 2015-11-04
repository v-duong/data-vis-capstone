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


function displayVisuals() {
	var dropDownSelected = $("#VisualList option:selected").val();
	var tableSelected = $("#TableList option:selected").val();


}

$("#xfrom").change(function(){
	console.log("fuck you");
});
	

// filters only for bar and scatter 
function generateBarFilters(){
	
	var xType = $("#x option:selected").text();
  	var yType = $("#y option:selected").text();
  	var zType = $("#z option:selected").text();
  	console.log('lei goh lo mo hai');
  	console.log(xType);
	//Columns for X

	$("#filters.off-canvas-submenu").html(""); 
	
/*
	$("#filters.off-canvas-submenu").append('<li>X: </li');
	$("#filters.off-canvas-submenu").append('From: <input type="text" id="xfrom"></input>');
	$("#filters.off-canvas-submenu").append('To: <input type="text" id="xto"></input>');

	//Columns for Y

	$("#filters.off-canvas-submenu").append('<li>Y: </li');
	$("#filters.off-canvas-submenu").append('From: <input type="text" id="yfrom"></input>');
	$("#filters.off-canvas-submenu").append('To: <input type="text" id="yto"></input>');


	//Columns for Z
	$("#filters.off-canvas-submenu").append('<li>Z: </li');
	$("#filters.off-canvas-submenu").append('From: <input type="text" id="zfrom"></input>');
	$("#filters.off-canvas-submenu").append('To: <input type="text" id="zto"></input>');
*/


	$("#filters.off-canvas-submenu").append('<li>X: </li');
	$("#filters.off-canvas-submenu").append('From: <input type="text" class="BarTextClass"></input>');
	$("#filters.off-canvas-submenu").append('To: <input type="text" class="BarTextClass"></input>');

	//Columns for Y

	$("#filters.off-canvas-submenu").append('<li>Y: </li');
	$("#filters.off-canvas-submenu").append('From: <input type="text" class="BarTextClass"</input>');
	$("#filters.off-canvas-submenu").append('To: <input type="text" class="BarTextClass"></input>');


	//Columns for Z
	$("#filters.off-canvas-submenu").append('<li>Z: </li');
	$("#filters.off-canvas-submenu").append('From: <input type="text" class="BarTextClass"></input>');
	$("#filters.off-canvas-submenu").append('To: <input type="text" class="BarTextClass"</input>');
	
}



function generateBar(){
  clearmeshes();
	generateBarFilters();

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

  // if xType == 0 

  console.log(xType);
  console.log(yType);
  console.log(zType);

  var getColumnTypeQuery = "SELECT " + x + ", " + y + ", " + z + " from " + tableSelected;

  console.log($("#testing_purposes").val());
  // appending additional filtering queries
  $(".BarTextClass").each(function(){
    if($(this).val()!="")
  		console.log($(this).val());
  	else
  		console.log("NULL");
 });

  if (xType == 'real'){
  	console.log("Fuck me");
  	console.log($("#xfrom").val());
  }

  if (yType == 'real'){

  }

  if (zType == 'real'){

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