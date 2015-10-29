function setupBaseScene(){
	var ASPECT = win.innerWidth / win.innerHeight;
	var FAR = 1000;
	var FOV = 45;
	var NEAR = 0.1

	scene = new Three.Scene();
	camera = new Three.PerspectiveCamera(FOV, SPECT, NEAR, FAR);
	renderer = new Three.WebGLRenderer({antialias: true});
	renderer.setClearColor(0x000000);
	renderer.shadowMapEnabled = true;
	renderer.setSize(win.innerWidth, win.innerHeight);
	$el.append(renderer.domElement);


	//--Pull the camera up 120 and outwards 300
	camera.position.x = 0;
	camera.position.y = -120;
	camera.position.x = 300;

}