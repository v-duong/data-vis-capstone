var camera, scene, renderer
var controls, texts

var meshes = []





function init(){
  scene = new THREE.Scene();
}



$("#VisualList").change(function(){
	var tableSelected = $("#VisualList option:selected").val();
	switch(tableSelected){
		case 'bar':
			break;
		case 'scatter':
			break;
		default:
			break;
	}

});

// table selected, time to show columns
$("#TableList").change(function(){
	var tableSelected = $("#TableList option:selected").val();
	var getColumnTypeQuery = "SELECT column_name ,data_type FROM information_schema.columns where table_name = '";
	getColumnTypeQuery = getColumnTypeQuery.concat(tableSelected + "'");
	console.log(getColumnTypeQuery);

	$("#filters.off-canvas-submenu").html("");
	$.getJSON('/retrieveData', { myQuery : getColumnTypeQuery }, function(data){
		// create a dropdown list


		var htmlStr = '';
		//$("#filters.off-canvas-submenu").append('<li><select>');

		// populate dropdown list with columnNames and Values
		for (var i = 0; i < data.length; i++){
			//$("#filters.off-canvas-submenu").append('<option value="' + data[i].data_type + '">' + data[i].column_name + '</option>');
			htmlStr = htmlStr.concat('<option value="' + data[i].data_type + '">' + data[i].column_name + '</option>');
		}


		//$.each(data, function(j, g){

		//});
		htmlStr = htmlStr.concat('</select></li>');
		$("#filters.off-canvas-submenu").append('<li><select id="x">' + htmlStr);
		$("#filters.off-canvas-submenu").append('<li><select id="y">' + htmlStr);
		$("#filters.off-canvas-submenu").append('<li><select id="z">' + htmlStr);

	});




});


function displayVisuals() {
	var dropDownSelected = $("#VisualList option:selected").val();
	var tableSelected = $("#TableList option:selected").val();


}

function generateBarFilters(){
	// initialize Column Selection



	//Columns for X


	//Columns for Y


	//Columns for Z
}

//Xinglun Xu add generateScatter function here
function generateScatter()
{
	clearmeshes();
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 10000 );
	renderer = new THREE.WebGLRenderer({alpha:true});
	texts = [];
	setupScene();
	var geometry = new THREE.SphereGeometry( 0.25, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
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
	renderScatter();
	// console.log("generateScatter is called");
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


function fetchData(){

}
