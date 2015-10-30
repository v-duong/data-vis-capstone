var camera, scene, renderer, geometry, material, mesh

init()





function init(){
  scene = new THREE.Scene();
}


$("#VisualList").change(function(){
	console.log($("#VisualList option:selected").val());
});

function visualSelected() {
	var dropDownSelected = $("#VisualList option:selected").val();
	
	switch(dropDownSelected){
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