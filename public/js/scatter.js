var renderScatter = function () {
	RENDERID = requestAnimationFrame(renderScatter);
	textFaceCamera(texts);
	if (vrModeIsOn) {
    	effect.render(scene, camera);
  	}
  	else {
    	renderer.render(scene, camera);
  	}
	controls.update();
<<<<<<< HEAD
	checkHighlight();
	CheckMouseSphere();
	// console.log("renderScatter is called");
};
=======
}
>>>>>>> 356b0faf2757f3a7a5f440d493161cd841d37145

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
		meshes.push(tempLine);
	}
};

// function createTextCanvas(text, color, font, size) {

//     size = size || 24;
//     var canvas = document.createElement('canvas');
//     var ctx = canvas.getContext('2d');
//     var fontStr = (size + 'px ') + (font || 'Arial');
//     ctx.font = fontStr;
//     var w = ctx.measureText(text).width;
//     var h = Math.ceil(size);

//     canvas.width = w;
//     canvas.height = h;

//     ctx.font = fontStr;

//     ctx.fillStyle = color || 'black';
//     ctx.fillText(text, 0, Math.ceil(size * 0.8));

//     return canvas;

// }

var drawText = function(text, x, y, z, texts)
{
	// var canvas = createTextCanvas(text, 0xdddddd, null, 1);
	// var plane = new THREE.PlaneGeometry(canvas.width, canvas.height);
	// var tex = new THREE.Texture(canvas);
	// // tex.minFilter = THREE.LinearFilter;
	// tex.needsUpdate = true;
	// var planeMat = new THREE.MeshBasicMaterial({
 //        map: tex,
 //        color: 0xffffff,
 //        transparent: true
 //    });

	var TextGeo = new THREE.TextGeometry(text, {
		font:  'helvetiker'
		,height:0
		,size:0.2
		});
	var textMaterial = new THREE.MeshPhongMaterial({
	color: 0xdddddd
	});

	var tempNumber = new THREE.Mesh(TextGeo,textMaterial);
	texts.push(tempNumber);
	tempNumber.quaternion.copy(camera.quaternion);
	tempNumber.position.set(x,y,z);
	scene.add(tempNumber);
	meshes.push(tempNumber);
}

var textFaceCamera = function(texts)
{
	for(var i=0; i<texts.length; i++)
	{
		//console.log(texts[i]+"?");
		// texts[i].quaternion.copy( camera.quaternion );
		texts[i].lookAt(camera.position);
	}
}

var drawNumbers = function(startPoint, movingDirection, movingDistance,times,texts)
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
		texts.push(tempNumber);
		scene.add(tempNumber);
		meshes.push(tempNumber);
	}
}

var flipText = function(object)
{
	object.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
	object.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI);
}

var createNode = function(geometry, material, x, y, z)
{
	var sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.25, 32, 32 ), new THREE.MeshBasicMaterial( {color: 0xffff00} ));
	sphere.position.set(x,y,z);
	scene.add( sphere );
	meshes.push(sphere);
	targetlist.push(sphere);
}

var displayNodes = function(data,geometry,material, x, y, z)
{
	var temp;
	var xScale = findMax(data, x);
	var yScale = findMax(data, y);
	var zScale = findMax(data, z);
	// console.log("Maxx: "+xScale+" Maxy:"+yScale+" Maxz: "+zScale);
	var _x = 0;
	var _y = 0;
	var _z = 0;
	for(var i in data)
	{
		temp = data[i];
		if(eval("temp."+x) != "NULL"){_x = eval("temp."+x)*5/xScale;}
		if(eval("temp."+y) != "NULL"){_y = eval("temp."+y)*5/yScale;}
		if(eval("temp."+z) != "NULL"){_z = eval("temp."+z)*5/zScale;}
		createNode(geometry,material, _x, _y, _z);
		// console.log("Before x: "+eval("temp."+x)+" y:"+eval("temp."+y)+" z: "+eval("temp."+z));
		// console.log("After x: "+_x+" y:"+_y+" z: "+_z);
	}
}


var findMax = function(data, name)
{
	var max = 0;
	var temp;
	for(var i in data)
	{
		temp = parseFloat(eval("data[i]."+name));
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

	renderer.setClearColor( 0xffffff, 1);
	renderer.setSize( window.innerWidth, window.innerHeight );
	cameraPosition(10, 10, 10);
	scene.add(camera);
	// document.body.appendChild( renderer.domElement );

	controls = new THREE.OrbitControls( camera , renderer.domElement);
	// controls.addEventListener( 'change', renderScatter );

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
	meshes.push(plane); meshes.push(plane1);meshes.push(plane2);



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

	var Xaxis = drawLine(new THREE.Vector3(0,0,0), new THREE.Vector3(6,0,0));
	var Yaxis = drawLine(new THREE.Vector3(0,0,0), new THREE.Vector3(0,6,0));
	var Zaxis = drawLine(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,6));
	scene.add(Xaxis); scene.add(Yaxis); scene.add(Zaxis);
	meshes.push(Xaxis); meshes.push(Yaxis); meshes.push(Zaxis);



	// var TextGeo = new THREE.TextGeometry( '13', {
	// 	font:  'helvetiker'
	// 	,height:0
	// 	,size:1.0
	// });
	// var textMaterial = new THREE.MeshPhongMaterial({
	// color: 0xdddddd
	// });
	// var text = new THREE.Mesh(TextGeo,textMaterial);
	// changePosition(text, 3,0,2);

	// camera.up = new THREE.Vector3(0,0,1);
	// camera.lookAt(new THREE.Vector3(0,0,0));
}
