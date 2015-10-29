function init($element) {
	var STARS = 600;
	var point;

	$el = $element;
	setupBaseScene();
	addLights();

	for (i=0; i<STARS; i++){
		point = addPoint(0xffffff, 2, 3, 3);
		point.position.x = getRandomArbitrary(-400, 400);
		point.position.y = getRandomArbitrary(-20, -1000);
		point.position.z = getRandomArbitrary(-400, 100);
	}

	update();
	render();
}

return {
	init: init,
	update: update,
	render: render
};

function addPoint(color, radius, widthSegments, heightSegments) {
	var geometry;
	var material;
	var shape;

	geometry = new Three.SphereGeometry(radius, widthSegments, heightSegments);
	material = new Three.MeshLamberMaterial({
		emissive: 0x000000,
		color: color,
		transparent: true,
		opacity: 0.8

	});

	shape = new Three.Mesh(geometry, material);
	scene.add(shape);

	return shape;

}