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
var vector
var sprite1;
var canvas1,context1,texture1;

var FilterArray = [];

function init(){
  scene = new THREE.Scene();
  window.addEventListener('resize', onWindowResize, false);
  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  $('.visual').append(renderer.domElement);
  sphereToggle = false;

    canvas1 = document.createElement('canvas'); //canvas for text popup
    context1=canvas1.getContext('2d');

    texture1 = new THREE.Texture(canvas1); //texture for canvas
    texture1.needsUpdate = true;
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
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
	switch(visualSelected){
		case 'bar':
		case 'scatter':
			var tableSelected = $("#TableList option:selected").val();
			var getColumnTypeQuery = "SELECT column_name ,data_type FROM information_schema.columns where table_name = '";
			getColumnTypeQuery = getColumnTypeQuery.concat(tableSelected + "'");

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
				$("#columnSelection.off-canvas-submenu").append('<li><p>X:</p> <select id="xColumn">' + htmlStr);
				$("#columnSelection.off-canvas-submenu").append('<li><p>Y:</p> <select id="yColumn">' + htmlStr);
				$("#columnSelection.off-canvas-submenu").append('<li><p>Z:</p> <select id="zColumn">' + htmlStr);

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
      generateNumericColumnFilter('#xColumn');
      break;
    case 'text':
      generateTextColumnFilter('#xColumn');
      break;
    default:
      break;
  }


});

$(document).on('change', '#yColumn', function(){
  switch (this.value){
    case 'double precision':
      generateNumericColumnFilter('#yColumn');
      break;
    case 'text':
      generateTextColumnFilter('#yColumn');
      break;
    default:
      break;
  }


});
$(document).on('change', '#zColumn', function(){
  switch (this.value){
    case 'double precision':
      generateNumericColumnFilter('#zColumn');
      break;
    case 'text':
      generateTextColumnFilter('#zColumn');
      break;
    default:
      break;
  }


});

function generateTextColumnFilter(colID){
  var tableSelected = $("#TableList option:selected").val();
  var ColName = $(colID.concat(" option:selected")).text();
  //var getMinMaxQuery = 'select max(' + ColName + '), min(' + ColName + ') FROM ' + tableSelected;
  var getSelectionQuery = 'select distinct '+ColName+' from '+tableSelected+' where '+ColName+' is not null order by '+ColName;

  var filterID;
  var formID;
  var amountName;

  switch (colID){
    case '#xColumn':
      formID = "X";
      filterID = "#filters1";
      break;
    case '#yColumn':
      formID = "Y";
      filterID = "#filters2";
      break;
    case '#zColumn':
      formID = "Z";
      filterID = "#filters3";
      break;
  }

  // retrieve all items in column that's alphabeticalized. Then generate Check boxes.
  $.getJSON('/retrieveData', { myQuery : getSelectionQuery }, function(data){
    $(filterID).html("");
    //$(filterID).append('<input id=' + amountName.substring(1) + ' type=text onkeypress=”return isNumber(event);” ></input>' + '<div id=' + slideName.substring(1) + '></div>');
    var randomStr = formID + ':<br><form id='+ formID +' style="height:100px;width:230px;border:1px solid #ccc;font:16px/26px Georgia, Garamond, Serif;overflow-y:auto;overflow-x:auto;">'
    //$(filterID).append('<form id='+ formID +'>');

    for (var i = 0; i < data.length; i++){

      randomStr = randomStr.concat('<div>\
        <input type="checkbox" value="'+data[i][ColName]+'" id="'+formID+'">\
        <p>'+data[i][ColName]+'</p>\
      </div>');


    }
    randomStr = randomStr.concat('<div id="log"></div></form><br>');

    //$(filterID).append('<div id="log"></div></form>');

    $(filterID).append(randomStr);

  });

}




// create a filter for
function generateNumericColumnFilter(colID){
	var tableSelected = $("#TableList option:selected").val();
  var ColName = $(colID.concat(" option:selected")).text();
  var getMinMaxQuery = 'select max(' + ColName + '), min(' + ColName + ') FROM ' + tableSelected;



  var filterID;
  var slideName;
  var amountName;
  var filterLabel;
  switch (colID){
    case '#xColumn':
      slideName = "#sliderX";
      amountName = "#amountX";
      filterID = "#filters1";
      filterLabel = "X";
      break;
    case '#yColumn':
      slideName = "#sliderY";
      amountName = "#amountY";
      filterID = "#filters2";
      filterLabel = "Y";
      break;
    case '#zColumn':
      slideName = "#sliderZ";
      amountName = "#amountZ";
      filterID = "#filters3";
      filterLabel = "Z";
      break;
  }

  $.getJSON('/retrieveData', { myQuery : getMinMaxQuery }, function(data){
    $(filterID).html("");
    $(filterID).append(filterLabel + ':<input id=' + amountName.substring(1) + ' type=text onkeypress=”return isNumber(event);” ></input>' + '<div id=' + slideName.substring(1) + '></div><br>');
    var stepValue = 1;
    var dataDiff = data[0].max - data[0].min;

    if (dataDiff < 100){
        while(dataDiff  < 100 ){
          dataDiff = dataDiff * 10;
          stepValue = stepValue/10;
        }
    }
    $( slideName ).slider({
    	range: true,
    	min: parseFloat(data[0].min),
    	max: parseFloat(data[0].max),
    	values: [ data[0].min, data[0].max ],
      step: stepValue,
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
      graphType = 'bar';
      generateBar();
      break;
    case 'scatter':
      graphType = 'scatter';
      generateScatter();
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

  // start of query
  var getColumnTypeQuery = "SELECT " + x + ", " + y + ", " + z + " from " + tableSelected;

  var startWord = " where";

  /*
  select manufacturer_pregen, model, cpu_speed, _price from tryagainsmartphone where _price >= 200 and _price <= 400 and (manufacturer_pregen = 'Samsung'or manufacturer_pregen = 'HTC');
  $('input#X:checked')[0]
  */

  switch(xType){
    case 'double precision':
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
      break;
    case 'text':
      // checkboxes are selected
      if ($('input#X:checked').length != 0) {
        //and (manufacturer_pregen = 'Samsung'or manufacturer_pregen = 'HTC');
        getColumnTypeQuery = getColumnTypeQuery.concat(startWord + " (" + x + " = '" + $('input#X:checked')[0].value + "'");
        for (var i = 1; i < $('input#X:checked').length; i++){
          getColumnTypeQuery = getColumnTypeQuery.concat(" or " + x + " = '" + $('input#X:checked')[i].value + "'");
        }
        getColumnTypeQuery = getColumnTypeQuery.concat(")");
        startWord = " and";
      }
      break;
    default:
      break;


  }


  switch(yType){
    case 'double precision':
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
      break;
    case 'text':
      // checkboxes are selected
      if ($('input#Y:checked').length != 0) {
        //and (manufacturer_pregen = 'Samsung'or manufacturer_pregen = 'HTC');
        getColumnTypeQuery = getColumnTypeQuery.concat(startWord + " (" + y + " = '" + $('input#Y:checked')[0].value + "'");
        for (var i = 1; i < $('input#Y:checked').length; i++){
          getColumnTypeQuery = getColumnTypeQuery.concat(" or " + y + " = '" + $('input#Y:checked')[i].value + "'");
        }
        getColumnTypeQuery = getColumnTypeQuery.concat(")");
        startWord = " and";
      }
      break;
    default:
      break;
  }

  switch(zType){
    case 'double precision':
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
      break;
    case 'text':
      // checkboxes are selected
      if ($('input#Z:checked').length != 0) {
        //and (manufacturer_pregen = 'Samsung'or manufacturer_pregen = 'HTC');
        getColumnTypeQuery = getColumnTypeQuery.concat(startWord + " (" + z + " = '" + $('input#Z:checked')[0].value + "'");
        for (var i = 1; i < $('input#Z:checked').length; i++){
          getColumnTypeQuery = getColumnTypeQuery.concat(" or " + z + " = '" + $('input#Z:checked')[i].value + "'");
        }
        getColumnTypeQuery = getColumnTypeQuery.concat(")");
        startWord = " and";
      }
      break;
    default:
      break;
  }

  return getColumnTypeQuery;

}

//Xinglun Xu add generateScatter function here
function generateScatter()
{
  clearmeshes();
  if (RENDERID != null)
    cancelAnimationFrame( RENDERID );
  if (!INITIAL) {
    init();
    INITIAL = true;
     //mouse sphere
    var msphere= new THREE.Mesh(new THREE.SphereGeometry(0.1,8,8), new THREE.MeshBasicMaterial({ color: 0xf9f9f9 }));
    msphere.visible = false;
    scene.add(msphere);
    mouseSphere.push(msphere);
  }
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
  //add effect
  effect = new THREE.StereoEffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  targetlist = [];
  mousetargetlist = [];
  texts = [];
  var scales = [];
  setupScene();
  var normalMaterial = new THREE.MeshNormalMaterial();
var x = $("#xColumn option:selected").text();
var y = $("#yColumn option:selected").text();
var z = $("#zColumn option:selected").text();
  var getColumnTypeQuery = BarScatterFilterQuery();
  // console.log("generateScatter: "+x+" "+y+" "+z);
  $.getJSON('/retrieveData', {
    myQuery: getColumnTypeQuery
  }, function(data) {
    test = data;
    findScales(scales,data,x,y,z);
    displayNodes(data, x, y, z, scales);
    drawNumbers(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), 1, 7, texts,scales[0]);
    drawNumbers(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 1, 7, texts,scales[1]);
    drawNumbers(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1), 1, 7, texts,scales[2]);
  });
  drawText(x, 6, 0, 0, texts);
  drawText(y, 0, 6, 0, texts);
  drawText(z, 0, 0, 6, texts);

  renderScatter();
}


function generateBar(){
  clearmeshes();
  if (RENDERID != null)
    cancelAnimationFrame( RENDERID );

  if (!INITIAL) {
    init();
    INITIAL = true;
     //mouse sphere
    var msphere= new THREE.Mesh(new THREE.SphereGeometry(8,8,8), new THREE.MeshBasicMaterial({ color: 0xf9f9f9 }));
    msphere.visible = false;
    scene.add(msphere);
    mouseSphere.push(msphere);

  }
  initbars();
  animate();

  targetlist = [];
  mousetargetlist = [];
  scater_check = 0;
  var tableSelected = $("#TableList option:selected").val();
  var x = $("#x option:selected").text();
  var y = $("#y option:selected").text();
  var z = $("#z option:selected").text();


  // generate bar/Scatter Query Based on Filters

  var displayQuery = BarScatterFilterQuery();

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
  camera.left = -1 * windowHalfX;
  camera.right = windowHalfX;
  camera.top = 	windowHalfY;
  camera.bottom = -1 * 	windowHalfY;
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
      INTERSECTED.object.material.color = new THREE.Color((temp.r + Math.max(0.4 - temp.r, 0)) * coeff, (temp.g + Math.max(0.4 - temp.g, 0)) * coeff, (temp.b + Math.max(0.4 - temp.b, 0)) * coeff);
      scene.remove(sprite1);

      var resultx=Math.round(intersects[0].object.position.x*100)/100
      var resulty=Math.round(intersects[0].object.position.y*100)/100
      var resultz=Math.round(intersects[0].object.position.z*100)/100
    // POP UP TEXT, must create new sprite each time, updating did not work

      intersects[0].object.name = "X:"+resultx+ '\n'  + "Y:"+resulty+ '\n'  + "Z:"+resultz ;message = intersects[0].object.name;
      canvas1 = document.createElement('canvas');
      context1.clearRect(0,0,100,100);
      context1=canvas1.getContext('2d');
      context1.font = "Bold 30px Arial";
      var metrics = context1.measureText(message);
      var width = metrics.width;
      context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
      context1.fillRect( 0,0, width+16,20+16);
      context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
      context1.fillRect( 2,2, width+16,20+16 );
      context1.fillStyle = "rgba(0,0,0,1)"; // text color
      context1.fillText( message, 10,30 );
      texture1.needsUpdate = true;


      texture1 = new THREE.Texture(canvas1);
      texture1.needsUpdate = true;
      var spriteMaterial = new THREE.SpriteMaterial( { map: texture1, color: 0xffffff, fog: true } );
      sprite1 = new THREE.Sprite( spriteMaterial );

      if (graphType === 'bar') { //check if scatter or bar, adjusts sprite parameters


        //need to work on scaling so it is relative to bar size, dont know how to yet
        sprite1.scale.set(200,100,1)
        sprite1.position.set( 50, 50, 0 );
        scene.add( sprite1 );
        //need to work on putting sprite on a new scene, so other bars wont block the sprite
        // this will also fix the issue with positioning, right now i position it so sprite is above all other bars
        sprite1.position.set( intersects[0].object.position.x, intersects[0].object.position.y+150, intersects[0].object.position.z ); //update sprite position
      }

      else {
        sprite1.scale.set(1.5,1.5,1)
        sprite1.position.set( 50, 50, 0 );
        scene.add( sprite1 );
        sprite1.position.set( intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z ); //update sprite position

      }





    } else { // if thse mouse is over an object
      INTERSECTED.object.material.color = tmpColor;
      INTERSECTED.object.geometry.colorsNeedUpdate = true;
      INTERSECTED = intersects[0];
      tmpColor = INTERSECTED.object.material.color;
      temp = INTERSECTED.object.material.color
      INTERSECTED.object.material.color = new THREE.Color((temp.r + Math.max(0.4 - temp.r, 0)) * coeff, (temp.g + Math.max(0.4 - temp.g, 0)) * coeff, (temp.b + Math.max(0.4 - temp.b, 0)) * coeff);
      scene.remove(sprite1);
      var resultx=Math.round(intersects[0].object.position.x*100)/100
      var resulty=Math.round(intersects[0].object.position.y*100)/100
      var resultz=Math.round(intersects[0].object.position.z*100)/100
    // POP UP TEXT, must create new sprite each time, updating did not work
      intersects[0].object.name = "X:"+resultx+ '\n'  + "Y:"+resulty+ '\n'  + "Z:"+resultz ;
      message = intersects[0].object.name; //new line dsnt work
      canvas1 = document.createElement('canvas');
      context1.clearRect(0,0,100,100);
      context1=canvas1.getContext('2d');
      context1.font = "Bold 30px Arial";
      var metrics = context1.measureText(message);
      var width = metrics.width;
      context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
      context1.fillRect( 0,0, width+16,20+16);
      context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
      context1.fillRect( 2,2, width+16,20+16 );
      context1.fillStyle = "rgba(0,0,0,1)"; // text color
      context1.fillText( message, 10,30 );
      texture1.needsUpdate = true;


      texture1 = new THREE.Texture(canvas1);
      texture1.needsUpdate = true;

      var spriteMaterial = new THREE.SpriteMaterial( { map: texture1, color: 0xffffff, fog: true } );
      sprite1 = new THREE.Sprite( spriteMaterial );




      if (graphType === 'bar') { //check if scatter or bar, adjusts sprite parameters

        sprite1.scale.set(200,100,1)
        sprite1.position.set( 50, 50, 0 );
        scene.add( sprite1 );
        //need to work on putting sprite on a new scene, so other bars wont block the sprite
        // this will also fix the issue with positioning, right now i position it so sprite is above all other bars
        sprite1.position.set( intersects[0].object.position.x, intersects[0].object.position.y+150, intersects[0].object.position.z ); //update sprite position
      }
      else {
        sprite1.scale.set(1.5,1.5,1)
        sprite1.position.set( 50, 50, 0 );
        scene.add( sprite1 );

        sprite1.position.set( intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z ); //update sprite position

      }

    }

    INTERSECTED.object.geometry.colorsNeedUpdate = true;

  } else // there are no intersections
  {
    mouseSphereCoords = null;
    // restore previous intersection object (if it exists) to its original color
    if (INTERSECTED) {
      INTERSECTED.object.material.color = tmpColor;
      INTERSECTED.object.geometry.colorsNeedUpdate = true;
      sprite1.position.set( event.clientX+9999, event.clientY+999, 0 ); //moves sprite away from screen when not clicked on

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
