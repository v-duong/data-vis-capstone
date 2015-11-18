 //renderer render the whole scene and camera
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
}

//draw line according to two points and color
var drawLine = function(v1, v2, color)
{
  color = color || 0x000000;
	var material = new THREE.LineBasicMaterial({
	color: color
	});
	material.linewidth = 1;

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
	v1,
	v2
		);
	return new THREE.Line(geometry, material);
};


// draw several lines 
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

//draw a text
var drawText = function(text, x, y, z, texts)
{  
	var TextGeo = new THREE.TextGeometry(text, {
		font:  'helvetiker'
		,height:0
		,size:0.4
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


//make all the text in an array face the camera
var textFaceCamera = function(texts)
{
	for(var i=0; i<texts.length; i++)
	{
		texts[i].lookAt(camera.position);
	}
}

//draw a set of number along the axis
var drawNumbers = function(startPoint, movingDirection, movingDistance,times,texts, max)
{
	var temp = 0;
	var interval = max / (times-2); 
	for(i = 0; i < times-1; i++)
	{
		var TextGeo = new THREE.TextGeometry( temp.toFixed(2), {
		font:  'helvetiker'
		,height:0
		,size:0.3
		});
var textMaterial = new THREE.MeshPhongMaterial({
	color: 0xdddddd
});
var tempNumber = new THREE.Mesh(TextGeo,textMaterial);
tempNumber.position.set(startPoint.x, startPoint.y, startPoint.z);
		tempNumber.translateOnAxis(movingDirection,movingDistance*i);
		texts.push(tempNumber);
		scene.add(tempNumber);
		meshes.push(tempNumber);
	temp += interval;
	}
}

//create a node 
var createNode = function(x, y, z, scales)
{
	//console.log(getColor(x,y,z,scales).toString(16));
	var sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.1, 32, 32 ), new THREE.MeshBasicMaterial( {color: getColor(x,y,z,scales)} ));
	sphere.position.set(x,y,z);
	scene.add( sphere );
	meshes.push(sphere);
	targetlist.push(sphere);
}

//create the color of a node based on its position
var getColor = function(x,y,z,scales){
	var xcolor = Math.floor(x*85/5);
	var ycolor = Math.floor(y*85/5);
	var zcolor = Math.floor(y*85/5);
	var color = 255-(xcolor + ycolor + zcolor);

	var hexcolor = color.toString(16);
	return parseInt(rgbToHex(255,hexcolor,hexcolor));
}

var componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

var  rgbToHex = function(r, g, b) {
    return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//find the max number on all the directions of axis
var findScales = function(scales, data, xname, yname, zname){
	var xScale = findMax(data, xname);
	var yScale = findMax(data, yname);
	var zScale = findMax(data, zname);
	scales.push(xScale); scales.push(yScale); scales.push(zScale);
}

//find the max value for a given set of data
var findMax = function(data, name)
{
	var max = 0;
	var temp;
	for(var i in data)
	{
		temp = parseFloat(data[i][name]);
		// if(temp == "NULL"){continue;}
		if(temp > max){ max = temp;}
		// console.log(data[i].name);
	}
	if(max == 0){max = 1;}
	return max;
}

//generate the nodes based on the chosen column 
var displayNodes = function(data, x, y, z, scales)
{
	var temp;
	var xScale = scales[0];
	var yScale = scales[1];
	var zScale = scales[2];
	// console.log("Maxx: "+xScale+" Maxy:"+yScale+" Maxz: "+zScale);
	var _x = 0;
	var _y = 0;
	var _z = 0;
	for(var i in data)
	{
		temp = data[i];
		if(temp[x] != "NULL"){_x = temp[x]*5/xScale;}
		if(temp[y] != "NULL"){_y = temp[y]*5/yScale;}
		if(temp[z] != "NULL"){_z = temp[z]*5/zScale;}
		createNode(_x, _y, _z,scales);
	}
}

//setup the scatter plot 
var setupScene = function()
{
	var width = window.innerWidth;
	var height = window.innerHeight;

	var camFactor = 130;

	renderer.setClearColor( 0xffffff, 1);
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.position.set(10,10,10);
	scene.add(camera);

	controls = new THREE.OrbitControls( camera , renderer.domElement);

	var geometry = new THREE.PlaneGeometry( 5, 5);
	var material = new THREE.MeshBasicMaterial( {color: 0xF0F0F0, side: THREE.DoubleSide, transparent:true, opacity: 0.3} );
	var material1 = new THREE.MeshBasicMaterial( {color: 0xC1C1C1, side: THREE.DoubleSide, transparent:true,opacity: 0.3} );
	var material2 = new THREE.MeshBasicMaterial( {color: 0x989898, side: THREE.DoubleSide, transparent:true,opacity: 0.3} );
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

}
