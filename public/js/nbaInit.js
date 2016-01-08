var camera, scene, renderer;

function generateCourt() {
  var tableSelected = $("#TeamName option:selected").val();
  console.log(tableSelected);
  generatePlainCourtTexture();

}

function generatePlainCourtTexture(){

  var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

  $('.visual').append(renderer.domElement);
	var geometry = new THREE.BoxGeometry( 940, 500, 1 );
	var material = new THREE.MeshBasicMaterial( { map : THREE.ImageUtils.loadTexture("static/img/wooden_basketball_court.jpg")} );
	var cube = new THREE.Mesh( geometry, material );

	scene.add( cube );
	camera.position.z = 500;
	var render = function () {
		requestAnimationFrame( render );
		renderer.render(scene, camera);
	};
	render();

}
