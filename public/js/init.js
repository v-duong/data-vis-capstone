var camera, scene, renderer
var controls, texts
var effect
var meshes = []
var targetlist
var INTERSECTED
var INITIAL = false
var hidecontrols
var graphType
var RENDERID = null
var mouseSphere=[]
var sphereToggle = false;

function init(){
  scene = new THREE.Scene();
  window.addEventListener('resize', onWindowResize, false);
  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  $('.visual').append(renderer.domElement);
  var msphere= new THREE.Mesh(new THREE.SphereGeometry(8,8,8), new THREE.MeshBasicMaterial({ color: 0xf9f9f9 }));
  scene.add(msphere);
  mouseSphere.push(msphere);
  sphereToggle = false;
}

$("#sphere").change(function(){
  if (this.checked)
    sphereToggle = true;
  else {
    sphereToggle = false;
  }
})



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

				htmlStr = htmlStr.concat('</select></li>');
				$("#columnSelection.off-canvas-submenu").append('<li>X: <select id="xColumn">' + htmlStr);
				$("#columnSelection.off-canvas-submenu").append('<li>Y: <select id="yColumn">' + htmlStr);
				$("#columnSelection.off-canvas-submenu").append('<li>Z: <select id="zColumn">' + htmlStr);

				//generateBarFilters();

			});
			break;
		default:
			alert("Please choose a Visualization");
			$("#TableList").val('');	// set it back to default
			break;


	}


});

// Changes for Dynamic Column
// each column will generate its own desired filters
$(document).on('change', '#xColumn', function(){
  switch (this.value){
    case 'double precision':
      console.log("calling generateColumNFilter");
      generateColumnFilter('#xColumn');
      break;
    case 'text':
      break;
    default:
      console.log("no " + this.value + " support yet");
  }


});

$(document).on('change', '#yColumn', function(){
  switch (this.value){
    case 'double precision':
      console.log("calling generateColumNFilter");
      generateColumnFilter('#yColumn');
      break;
    case 'text':
      break;
    default:
      console.log("no " + this.value + " support yet");
  }


});
$(document).on('change', '#zColumn', function(){
  switch (this.value){
    case 'double precision':
      console.log("calling generateColumNFilter");
      generateColumnFilter('#zColumn');
      break;
    case 'text':
      break;
    default:
      console.log("no " + this.value + " support yet");
  }


});

// create a filter for
function generateColumnFilter(colID){
	var tableSelected = $("#TableList option:selected").val();
  var ColName = $(colID.concat(" option:selected")).text();
  var getMinMaxQuery = 'select max(' + ColName + '), min(' + ColName + ') FROM ' + tableSelected;
  console.log(getMinMaxQuery);

  var slideName;
  var amountName;
  switch (colID){
    case '#xColumn':
      slideName = "#sliderX";
      amountName = "#amountX";
      break;
    case '#yColumn':
      slideName = "#sliderY";
      amountName = "#amountY";
      break;
    case '#zColumn':
      slideName = "#sliderZ";
      amountName = "#amountZ";
      break;
  }

  $.getJSON('/retrieveData', { myQuery : getMinMaxQuery }, function(data){
    console.log(data[0].min);
    console.log(data[0].max);
    console.log(slideName);
    console.log(amountName);
    $( slideName ).slider({
    	range: true,
    	min: parseFloat(data[0].min),
    	max: parseFloat(data[0].max),
    	values: [ data[0].min, data[0].max ],
    	slide: function( event, ui ) {
    		$( amountName ).val(  ui.values[ 0 ] + " - " + ui.values[ 1 ] );
    	}

    	});
    	$( amountName ).val(  $( slideName ).slider( "values", 0 ) + " - " + $( slideName ).slider( "values", 1 ) );

  });
};




function generateVisuals() {
  var tableSelected = $("#VisualList option:selected").val();
  switch (tableSelected) {
    case 'bar':
      generateBar();
      graphType = 'bar'
      break;
    case 'scatter':
      generateScatter();
      graphType = 'scatter'
      break;
    default:
      break;
  }
}

// Creates a query based on Table, Columns, and Filters for Bar and Scatter
function BarScatterFilterQuery(){


  var tableSelected = $("#TableList option:selected").val();
  var x = $("#xColumn option:selected").text();
  var y = $("#yColumn option:selected").text();
  var z = $("#zColumn option:selected").text();

  var xType = $("#xColumn option:selected").val();
  var yType = $("#yColumn option:selected").val();
  var zType = $("#zColumn option:selected").val();

  var tempFrom;
  var tempTo;

  console.log(tableSelected);
  console.log(x);
  console.log(y);
  console.log(z);
  console.log(xType);
  console.log(yType);
  console.log(zType);

  // start of query
  var getColumnTypeQuery = "SELECT " + x + ", " + y + ", " + z + " from " + tableSelected;

  var startWord = " where";

  if (xType == 'double precision'){
  	tempFrom = $( "#sliderX" ).slider( "values", 0 );
  	tempTo = $( "#sliderX" ).slider( "values", 1 );
  	if(tempFrom!=""){
  	 	getColumnTypeQuery = getColumnTypeQuery.concat(" where "+x+" >= " + tempFrom);
      startWord = " and";
    }
    if(tempTo!=""){
  		getColumnTypeQuery = getColumnTypeQuery.concat(startWord + " "+x+" <= " + tempTo);
      startWord = " and";
    }
  }

  if (yType == 'double precision'){
  	tempFrom = $( "#sliderY" ).slider( "values", 0 );
  	tempTo = $( "#sliderY" ).slider( "values", 1 );
  	if(tempFrom!=""){
  	 	getColumnTypeQuery = getColumnTypeQuery.concat(startWord +" "+y+" >= " + tempFrom);
      startWord = " and";
    }
    if(tempTo!=""){
  		getColumnTypeQuery = getColumnTypeQuery.concat(startWord +" "+y+" <= " + tempTo);
      startWord = " and";
    }
  }

  if (zType == 'double precision'){
	tempFrom = $( "#sliderZ" ).slider( "values", 0 );
  	tempTo = $( "#sliderZ" ).slider( "values", 1 );
  	if(tempFrom!=""){
  	 	getColumnTypeQuery = getColumnTypeQuery.concat(startWord +" "+z+" >= " + tempFrom);
      startWord = " and";
    }
  	if(tempTo!=""){
  		getColumnTypeQuery = getColumnTypeQuery.concat(startWord +" "+z+" <= " + tempTo);
      startWord = " and";
    }
  }



  return getColumnTypeQuery;

}

//Xinglun Xu add generateScatter function here
function generateScatter()
{
  clearmeshes();
  if (!INITIAL) {
    init();
    INITIAL = true;
  }
  if (RENDERID != null)
    cancelAnimationFrame( RENDERID );
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);

  //add effect
  effect = new THREE.StereoEffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  targetlist = [];
  texts = [];
  setupScene();
  var geometry = new THREE.SphereGeometry(0.25, 32, 32);
  var material = new THREE.MeshBasicMaterial({
    color: 0xffff00
  });
  var normalMaterial = new THREE.MeshNormalMaterial();
/*
  var tableSelected = $("#TableList option:selected").val();
  var x = $("#xColumn option:selected").text();
  var y = $("#yColumn option:selected").text();
  var z = $("#zColumn option:selected").text();
  var getColumnTypeQuery = "SELECT " + x + ", " + y + ", " + z + " from " + tableSelected;
  console.log(getColumnTypeQuery);
*/
var x = $("#xColumn option:selected").text();
var y = $("#yColumn option:selected").text();
var z = $("#zColumn option:selected").text();
  var getColumnTypeQuery = BarScatterFilterQuery();
  console.log("Blah");
  console.log(getColumnTypeQuery);
  // console.log("generateScatter: "+x+" "+y+" "+z);
  $.getJSON('/retrieveData', {
    myQuery: getColumnTypeQuery
  }, function(data) {
    test = data;
    displayNodes(data, geometry, material, x, y, z);
  });
  drawNumbers(new THREE.Vector3(0, 5.1, 0), new THREE.Vector3(1, 0, 0), 1, 7, texts);
  drawText(x, 6, 0, 0, texts);
  drawText(y, 0, 6, 0, texts);
  drawText(z, 0, 0, 6, texts);
  window.addEventListener('resize', onWindowResize, false);

  renderScatter();
}


function generateBar(){
  clearmeshes();

  if (!INITIAL) {
    init();
    INITIAL = true;
  }
  if (RENDERID != null)
    cancelAnimationFrame( RENDERID );
  initbars();
  animate();

  targetlist = [];
/*
  var tableSelected = $("#TableList option:selected").val();
  var x = $("#x option:selected").text();
  var y = $("#y option:selected").text();
  var z = $("#z option:selected").text();
  */

  // generate bar/Scatter Query Based on Filters

  var displayQuery = BarScatterFilterQuery();
  console.log("Blah");
  console.log(displayQuery);

  //var getColumnTypeQuery = "SELECT " + x + ", " + y + ", " + z + " from " + tableSelected;
  //console.log(getColumnTypeQuery);
  var test;
  $.getJSON('/retrieveData', {
    myQuery: displayQuery
  }, function(data) {
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


function onDocumentMouseDown(event) //http://www.moczys.com/webGL/Experiment_02_V05.html
{
  // the following line would stop any other event handler from firing
  // (such as the mouse's TrackballControls)
  //event.preventDefault();

  // update the mouse variable
  var mouse = { x: 0, y: 0 };
  mouse.x = ( ( event.clientX - $('.visual').offset().left ) / renderer.domElement.width ) * 2 - 1;
  mouse.y = -( ( event.clientY - $('.visual').offset().top + document.body.scrollTop) / renderer.domElement.height ) * 2 + 1;
  vector = new THREE.Vector3(mouse.x, mouse.y, 0.1);

  var raycaster = new THREE.Raycaster();
  var dir = new THREE.Vector3(mouse.x, mouse.y, 0.1);

  if (camera instanceof THREE.OrthographicCamera) { //KEY BRANCH CONDITION: checks if ortha or prespetive
    vector.set(((event.clientX - $('.visual').offset().left ) / window.innerWidth) * 2 - 1, -((event.clientY - $('.visual').offset().top + document.body.scrollTop) / window.innerHeight) * 2 + 1, -1); // z = - 1 important!
    vector.unproject(camera);
    dir.set(0, 0, -1).transformDirection(camera.matrixWorld);
    raycaster.set(vector, dir);
  } else if (camera instanceof THREE.PerspectiveCamera) {
    vector.set(((event.clientX - $('.visual').offset().left ) / window.innerWidth) * 2 - 1, -((event.clientY - $('.visual').offset().top + document.body.scrollTop) / window.innerHeight) * 2 + 1, 0.5); // z = 0.5 important!
    vector.unproject(camera);
    raycaster.set(camera.position, vector.sub(camera.position).normalize());
  }

  var intersects = raycaster.intersectObjects(targetlist, true);
  var temp = 0;
  var coeff = 1.1;
  var mouseSphereCoords;
  if (intersects.length > 0) { // case if mouse is not currently over an object
    mouseSphereCoords = [intersects[0].point.x, intersects[0].point.y, intersects[0].point.z];
    if (INTERSECTED == null) {
      INTERSECTED = intersects[0];
      tmpColor = INTERSECTED.object.material.color;
      temp = INTERSECTED.object.material.color
      INTERSECTED.object.material.color = new THREE.Color((temp.r + Math.max(0.35 - temp.r, 0)) * coeff, (temp.g + Math.max(0.35 - temp.g, 0)) * coeff, (temp.b + Math.max(0.35 - temp.b, 0)) * coeff);

    } else { // if thse mouse is over an object
      INTERSECTED.object.material.color = tmpColor;
      INTERSECTED.object.geometry.colorsNeedUpdate = true;
      INTERSECTED = intersects[0];
      tmpColor = INTERSECTED.object.material.color;
      temp = INTERSECTED.object.material.color
      INTERSECTED.object.material.color = new THREE.Color((temp.r + Math.max(0.35 - temp.r, 0)) * coeff, (temp.g + Math.max(0.35 - temp.g, 0)) * coeff, (temp.b + Math.max(0.35 - temp.b, 0)) * coeff);
    }
    INTERSECTED.object.geometry.colorsNeedUpdate = true;

  } else // there are no intersections
  {
    mouseSphereCoords = null;
    // restore previous intersection object (if it exists) to its original color
    if (INTERSECTED) {
      INTERSECTED.object.material.color = tmpColor;
      INTERSECTED.object.geometry.colorsNeedUpdate = true;
    }
    // remove previous intersection object reference
    //     by setting current intersection object to "nothing"
  }
  if (sphereToggle)
    CheckMouseSphere(mouseSphereCoords);

}

function CheckMouseSphere(mouseSphereCoords){
 // if the coordinates exist, make the sphere visible
 if(mouseSphereCoords != null){
   mouseSphere[0].position.set(mouseSphereCoords[0],mouseSphereCoords[1],mouseSphereCoords[2]);
   mouseSphere[0].visible = true;
 }
 else{
   mouseSphere[0].visible = false;
  }
 }
