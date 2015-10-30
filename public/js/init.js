var camera, scene, renderer

var meshes = []





function init(){
  scene = new THREE.Scene();
}



$("#VisualList").change(function(){
	var tableSelected = $("#VisualList option:selected").val();
	switch(tableSelected){
		case 'bar':
			console.log('bar');
			generateBar();
			break;
		case 'scatter':
			console.log('scatter');
			break;
		default:
			console.log('broke');
			break;
	}

});

// table selected, time to show columns 
$("#TableList").change(function(){
	var tableSelected = $("#TableList option:selected").val();
	console.log(tableSelected);
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

function generateBar(){

	generateBarFilters();

	init();
	initbars();
	animate();
	addBar(1 * 50, 150 * 2, 1 * 50);
}
function clearmeshes() {
  for (var i = 0; i < meshes.length; i++) {
    scene.remove(meshes[i]);
  }
  meshes = [];
}
