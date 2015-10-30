var render = function () {
	requestAnimationFrame( render );
	renderer.render(scene, camera);
};

var cameraPosition = function(z, x, y)
{
	camera.position.z = z;
	camera.position.y = y;
	camera.position.x = x;
};
var changePosition = function(object, x, y, z)
{
	object.position.x = x;
	object.position.y = y;
	object.position.z = z;
};

var drawLine = function(v1, v2)
{
	var material = new THREE.LineBasicMaterial({
	color: 0x000000
	});
	material.linewidth = 1;

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
	v1,
	v2
		);
	return new THREE.Line(geometry, material);
};

var drawLines = function(line, movingDirection, movingDistance,times)
{
	for(i = 0; i < times-1; i++)
	{
		var tempLine = line.clone();
		tempLine.translateOnAxis(movingDirection, movingDistance*i);
		scene.add(tempLine);
	}
};

var drawNumbers = function(startPoint, movingDirection, movingDistance,times)
{
	for(i = 0; i < times-1; i++)
	{
		var TextGeo = new THREE.TextGeometry( i, {
		font:  'helvetiker'
		,height:0
		,size:0.2
		});
var textMaterial = new THREE.MeshPhongMaterial({
	color: 0xdddddd
});
var tempNumber = new THREE.Mesh(TextGeo,textMaterial);
changePosition(tempNumber, startPoint.x, startPoint.y, startPoint.z);
		tempNumber.translateOnAxis(movingDirection,movingDistance*i);
		scene.add(tempNumber);
	}
}


var flipText = function(object)
{
	object.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
	object.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI);
}

var createNode = function(geometry, material, x, y, z)
{
	var sphere = new THREE.Mesh( geometry, material );
	sphere.position.set(x,y,z);
	scene.add( sphere );
}

var findMax = function(data, name)
{
	var max = 0;
	var temp;
	for(var i in data)
	{
		temp = parseInt(eval("data[i]."+name));
		// if(temp == "NULL"){continue;}
		if(temp > max){ max = temp;}
		// console.log(data[i].name);
	}
	if(max == 0){max = 1;}
	return max;
}

var setupScene = function()
{
	var width = window.innerWidth;
	var height = window.innerHeight;

	var camFactor = 130;
	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );

	renderer.setClearColor( 0xffffff, 1);
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var geometry = new THREE.PlaneGeometry( 5, 5);
	var material = new THREE.MeshBasicMaterial( {color: 0xF0F0F0, side: THREE.DoubleSide} );
	var material1 = new THREE.MeshBasicMaterial( {color: 0xC1C1C1, side: THREE.DoubleSide} );
	var material2 = new THREE.MeshBasicMaterial( {color: 0x989898, side: THREE.DoubleSide} );
	var plane = new THREE.Mesh(geometry, material);
	var plane1 = new THREE.Mesh(geometry, material1);
	var plane2 = new THREE.Mesh(geometry, material2);
	plane.position.x = 2.5; plane.position.y = 2.5;
	plane1.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI*1/2);
	plane1.position.y = 0; plane1.position.z = 2.5; plane1.position.x = 2.5;
	plane2.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI*1/2);
	plane2.position.x = 0; plane2.position.y = 2.5; plane2.position.z = 2.5;
	scene.add( plane );
	scene.add(plane1);
	scene.add(plane2);



	var line = drawLine(new THREE.Vector3(0,5,0.01), new THREE.Vector3(0,0,0.01));
	var line1 = drawLine(new THREE.Vector3(5,0,0.01), new THREE.Vector3(0,0,0.01));
	var line2 = drawLine(new THREE.Vector3(0,0.01,5), new THREE.Vector3(5,0.01,5));
	var line3 = drawLine(new THREE.Vector3(5,0.01,0), new THREE.Vector3(5,0.01,5));
	var line4 = drawLine(new THREE.Vector3(0.01,0,0), new THREE.Vector3(0.01,5,0));
	var line5 = drawLine(new THREE.Vector3(0.01,0,0), new THREE.Vector3(0.01,0,5));
	drawLines(line,new THREE.Vector3(1,0,0), 1, 7);
	drawLines(line1, new THREE.Vector3(0,1,0),1, 7);
	drawLines(line2, new THREE.Vector3(0,0,-1),1,7);
	drawLines(line3, new THREE.Vector3(-1,0,0),1,7);
	drawLines(line4, new THREE.Vector3(0,0,1),1,7);
	drawLines(line5, new THREE.Vector3(0,1,0),1,7);



	var TextGeo = new THREE.TextGeometry( '13', {
		font:  'helvetiker'
		,height:0
		,size:1.0
	});
	var textMaterial = new THREE.MeshPhongMaterial({
	color: 0xdddddd
	});
	var text = new THREE.Mesh(TextGeo,textMaterial);
	changePosition(text, 3,0,2);
	drawNumbers(new THREE.Vector3(0,5.1, 0), new THREE.Vector3(1,0,0), 1, 7);


	cameraPosition(6, 5, 8);
	text.lookAt(camera.position);
	camera.up = new THREE.Vector3(0,0,1);
	camera.lookAt(new THREE.Vector3(0,0,0));
}


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({alpha:true});