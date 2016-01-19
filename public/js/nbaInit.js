var camera, scene, renderer;
var targetlist, mousetargetlist;
var INTERSECTED;
var mouseSphere = []
var sphereToggle = false;
var court;
var INITIAL = false
var zones = new Array(14);
var zonesMiss = new Array(14);
var zonesMade = new Array(14);
var zonesText = new Array(14);
var FirstTime = true;

var PointToZone = [[10,10,10,8,8,8,8,8,8,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,8,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,8,3,3,3,3,3,3,3,3,3,2,2,0,0,0,0,0,0,0,2,2,2,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,8,8,3,3,3,3,3,3,3,3,2,2,2,2,0,0,0,2,2,2,2,2,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,8,8,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,8,8,8,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,4,9,9,9],
[13,13,13,8,8,8,8,8,8,8,7,7,7,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,5,5,5,4,4,4,4,4,4,4,11,11,11,11],
[13,13,13,13,8,8,8,8,7,7,7,7,7,7,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,5,5,5,5,5,4,4,4,4,4,11,11,11,11,11],
[13,13,13,13,8,8,8,7,7,7,7,7,7,7,7,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,5,5,5,5,5,5,5,5,4,4,4,11,11,11,11,11],
[13,13,13,13,13,8,7,7,7,7,7,7,7,7,7,7,7,3,3,2,2,2,2,2,2,2,2,2,2,2,2,1,5,5,5,5,5,5,5,5,5,5,5,4,11,11,11,11,11,11],
[13,13,13,13,13,13,7,7,7,7,7,7,7,7,7,7,7,7,7,2,2,2,2,2,2,2,2,2,2,2,5,5,5,8,5,5,5,5,5,5,5,5,5,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,7,7,7,7,7,7,7,7,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,7,7,7,7,7,7,7,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,7,7,7,7,7,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,7,7,7,7,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,5,5,5,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,7,7,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,5,5,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,6,6,6,6,6,6,6,6,6,6,6,6,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11]];


function generateCourt() {

  var seasonText = $("#Season option:selected").val();

  if (seasonText == ""){
    alert('Please choose a Season');
    return;
  }
  var teamID = $("#TeamName option:selected").val();
  if (teamID == ""){
    alert('Please choose a team');
    return;
  }
  var playerID = $("#PlayerName option:selected").val();
  if (playerID == ""){
    alert('Please choose a player');
    return;
  }



  generatePlainCourtTexture();
  generateZones();
  retreiveNBAData();
}

function init() {
  window.addEventListener('resize', onWindowResize, false);
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  $('.visual').append(renderer.domElement);

}



function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.left = -1 * windowHalfX;
  camera.right = windowHalfX;
  camera.top = windowHalfY;
  camera.bottom = -1 * windowHalfY;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);

}


function generatePlainCourtTexture(){

  if (!INITIAL) {
    init();
    INITIAL = true;
  }
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

	//renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

  $('.visual').append(renderer.domElement);
	var geometry = new THREE.BoxGeometry( 940, 2, 500 );
	var material = new THREE.MeshBasicMaterial( { map : THREE.ImageUtils.loadTexture("static/img/basketball_court.png")} );
	court = new THREE.Mesh( geometry, material );

  var backboardMaterial = new THREE.MeshBasicMaterial ( {map : THREE.ImageUtils.loadTexture("static/img/backboard.jpg")} );


  var backboard = new THREE.Mesh(
    new THREE.BoxGeometry( 60, 35, 3),
    backboardMaterial );
  backboard.position.set(450,100,0);
  backboard.__dirtyPosition = true;
  backboard.rotation.set(0, Math.PI/2,0);
  //backboard.__dirtyRotation = true;

	scene.add( court );
  scene.add( backboard );
	camera.position.y = 500;
  camera.lookAt(0,0,0);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
	animate();


}


function genZone10(){
  // geometry
  var geo = new THREE.Geometry();
  geo.vertices.push( new THREE.Vector3( 0+329, 4, 0-250 ) );
  geo.vertices.push( new THREE.Vector3( 140+329, 4, 0-250 ) );
  geo.vertices.push( new THREE.Vector3( 140+329, 4, 30-250 ) );
  geo.vertices.push( new THREE.Vector3( 0+329, 4, 30-250 ) ); // close the loop
  geo.faces.push(new THREE.Face3(0,1,2));
  geo.faces.push(new THREE.Face3(0,2,3));

  var material = new THREE.MeshBasicMaterial({
    //color: 0x0000ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });

  zones[10] = new THREE.Mesh( geo, material );
  scene.add( zones[10]);
}
function genZone9(){
  var geo = new THREE.Geometry();
  geo.vertices.push( new THREE.Vector3( 0+329, 4, 0+220 ) );
  geo.vertices.push( new THREE.Vector3( 140+329, 4, 0+220 ) );
  geo.vertices.push( new THREE.Vector3( 140+329, 4, 30+220 ) );
  geo.vertices.push( new THREE.Vector3( 0+329, 4, 30+220 ) ); // close the loop
  geo.faces.push(new THREE.Face3(0,1,2));
  geo.faces.push(new THREE.Face3(0,2,3));

  var material = new THREE.MeshBasicMaterial({
    //color: 0x0f00ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  // line
  zones[9] = new THREE.Mesh( geo, material );
  scene.add( zones[9] );


}
function genZone0(){
  var shape = new THREE.Shape();
  shape.moveTo( 87.5, 0 );
  shape.absarc( 0, 0, 87.5, 0, (240/180)* Math.PI, false );

  var extrudeSettings = {
    amount : 1,
    steps : 1
  };
  var material = new THREE.MeshBasicMaterial({
    //color: 0x00ff00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  zones[0] = new THREE.Mesh(geometry, material);

  zones[0].rotation.set(Math.PI/2, 0,Math.PI/2.75);
  zones[0].position.set(425,0,0);
  zones[0].__dirtyPosition = true;

  scene.add(zones[0]);
}
function genZone1(){
    //var shape = new THREE.Shape();
    var geometry = new THREE.RingGeometry( 87.5, 167.5, 16, 2, 0, 80/180 * Math.PI);
    //shape.moveTo( 167.5, 0 );
    //shape.absarc( 0, 0, 167.5, 0, (80/180)* Math.PI, false );
    //shape.lineTo( 100, 50 );
    //var extrudeSettings = {
  //    amount : 1,
  ///    steps : 1
  //  };
    var material = new THREE.MeshBasicMaterial({
      //color: 0x00fff0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
  //  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    zones[1] = new THREE.Mesh(geometry, material);

    zones[1].rotation.set(Math.PI/2, 0,Math.PI/2.4);
    zones[1].position.set(425,2,0);
    zones[1].__dirtyPosition = true;

    scene.add(zones[1]);

}
function genZone2(){
  var geometry = new THREE.RingGeometry( 87.5, 167.5, 16, 2, 0, 50/180 * Math.PI);

  var material = new THREE.MeshBasicMaterial({
    //color: 0xfff000,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
//  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  zones[2] = new THREE.Mesh(geometry, material);

  zones[2].rotation.set(Math.PI/2, 0,(2*Math.PI/2.33));
  zones[2].position.set(425,2,0);
  zones[2].__dirtyPosition = true;

  scene.add(zones[2]);

}
function genZone3(){
  var geometry = new THREE.RingGeometry( 87.5, 167.5, 16, 2, 0, 80/180 * Math.PI);

  var material = new THREE.MeshBasicMaterial({
    //color: 0x00fff0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
//  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  zones[3] = new THREE.Mesh(geometry, material);

  zones[3].rotation.set(Math.PI/2, 0,(3*Math.PI/2.64));
  zones[3].position.set(425,2,0);
  zones[3].__dirtyPosition = true;

  scene.add(zones[3]);

}

function genZone5(){
  var geometry = new THREE.RingGeometry( 167.5, 247.5, 16, 2, 0, 40/180 * Math.PI);

  var material = new THREE.MeshBasicMaterial({
    //color: 0x0ccff0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
//  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  zones[5] = new THREE.Mesh(geometry, material);

  zones[5].rotation.set(Math.PI/2, 0,(2*Math.PI/3));
  zones[5].position.set(425,2,0);
  zones[5].__dirtyPosition = true;

  scene.add(zones[5]);
}

function genZone6(){
  var geometry = new THREE.RingGeometry( 167.5, 247.5, 16, 2, 0, 40/180 * Math.PI);

  var material = new THREE.MeshBasicMaterial({
    //color: 0xdccffd,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
//  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  zones[6] = new THREE.Mesh(geometry, material);

  zones[6].rotation.set(Math.PI/2, 0,(Math.PI/1.125));
  zones[6].position.set(425,2,0);
  zones[6].__dirtyPosition = true;

  scene.add(zones[6]);
}
function genZone7(){
  var geometry = new THREE.RingGeometry( 167.5, 247.5, 16, 2, 0, 40/180 * Math.PI);

  var material = new THREE.MeshBasicMaterial({
    //color: 0x0ffcc0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
//  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  zones[7] = new THREE.Mesh(geometry, material);

  zones[7].rotation.set(Math.PI/2, 0,(Math.PI/.9));
  zones[7].position.set(425,2,0);
  zones[7].__dirtyPosition = true;

  scene.add(zones[7]);
}

//87.5, 167.5, 16, 2, 0, 80/180 * Math.PI
function genZone4(){
  var curve = new THREE.EllipseCurve(
    0, 0,             // ax, aY
    80, 157.5,            // xRadius, yRadius
    -1/35 * Math.PI, 4.6/18 * Math.PI, // aStartAngle, aEndAngle
    false             // aClockwise
  );

  var points = curve.getSpacedPoints(20);
  var path = new THREE.Path();
  var geometry = path.createGeometry(points);
  geometry.vertices.push(new THREE.Vector3(125,150,0));
  geometry.vertices.push( new THREE.Vector3( 135, 125, 0 ) );
  geometry.vertices.push(new THREE.Vector3(135, -15, 0));
  geometry.vertices.push(new THREE.Vector3(75, -15, 0));
  geometry.faces.push(new THREE.Face3(20,21,22));
  for (var i = 0; i < 20; i++){
    geometry.faces.push(new THREE.Face3(i,i+1,22));
  }
  geometry.faces.push(new THREE.Face3(0,22,23));
  //geometry.faces.push(new THREE.Face3(20,22,23));
  //geometry.faces.push(new THREE.Face3(20,23,24));

  var material = new THREE.MeshBasicMaterial({
    //color: 0x0ffcc0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  //zones[4] = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x0f00ff}));
  zones[4] = new THREE.Mesh(geometry, material);
  zones[4].rotation.set(-Math.PI/2, 0,Math.PI/2);
  zones[4].position.set(455,4,-87.5);
  zones[4].__dirtyPosition = true;
  scene.add(zones[4]);

  //zone 5
  zones[8] = new THREE.Mesh(geometry, material);
  zones[8].rotation.set(Math.PI/2, 0, Math.PI/2);
  zones[8].position.set(455,4,87.5);
  zones[8].__dirtyPosition = true;
  scene.add(zones[8]);

  //var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x0f00ff}));
  //scene.add(line);
/*
  var geo = new THREE.Geometry();
  geo.vertices.push( new THREE.Vector3( 0, 4, 0) );
  geo.vertices.push( new THREE.Vector3( 140, 4, 0 ) );
  geo.vertices.push( new THREE.Vector3( 140, 4, 30) );
  geo.vertices.push(new THRE;
  geo.vertices.push( new THREE.Vector3( 0, 4, 30 ) ); // close the loop
  geo.faces.push(new THREE.Face3(0,1,2));
  geo.faces.push(new THREE.Face3(0,2,3));

  var material = new THREE.MeshBasicMaterial({
    color: 0x0f00ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  // line
  zones[4] = new THREE.Mesh( geo, material );
  scene.add( zones[4] );
  */

}
function genZone8(){

}



function generateZones(){
  if (FirstTime){
    genZone0();
    genZone1();
    genZone2();
    genZone3();
    genZone4();
    genZone5();
    genZone6();
    genZone7();
    //genZone8();
    genZone9();
    genZone10();
    //genZone11();
    //genZone12();
    //genZone13();

  }
};

function animate() {
  RENDERID = requestAnimationFrame(animate);
  render();
}

function render() {
    renderer.render(scene, camera);
}

function generateYears(){
  var curYear = new Date().getFullYear();

  var yearsSinceBeginning = curYear - 1947
  var tempStr = "";
  $("#yearSelection.off-canvas-list").html("");
  var htmlStr = "<option value='' selected='selected' disabled='disabled'> Choose Season </option>";
  for (var i = 0; i < yearsSinceBeginning; i++){
    tempStr = (curYear - (i+1)).toString() + " - " + (curYear - (i)).toString();
    htmlStr = htmlStr.concat('<option value="' + tempStr + '">' + tempStr + '</option>');

  }
  htmlStr = htmlStr.concat('</select></li>');
  $("#yearSelection.off-canvas-list").append('<li> <select id="Season">' + htmlStr);
}


function genListOfTeam(yearSpan){
  var yearSpanStr = yearSpan.toString();
  $("ul#teamSelection.off-canvas-submenu").html("");

  //2015 - 2016 -> 2015-16
  var yearID = yearSpanStr.slice(0,4) + "-" + yearSpanStr.slice(-2);

  var teamUrl = 'http://stats.nba.com/stats/leaguedashteamstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season='
    + yearID +
    '&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&VsConference=&VsDivision=';
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      url: teamUrl,
      success: function(data) {
        //console.log(data.resultSets[0].rowSet);
        var teamSet = data.resultSets[0].rowSet;
        $("#teamSelection.off-canvas-list").html("");
        var htmlStr = "<option value='' selected='selected' disabled='disabled'> Choose Team </option>";;
        for (var i = 0; i < teamSet.length; i++ ){
          htmlStr = htmlStr.concat('<option value="' + teamSet[i][0] + '">' + teamSet[i][1] + '</option>');

        }
        htmlStr = htmlStr.concat('</select></li>');
        $("#teamSelection.off-canvas-list").append('<li> <select id="TeamName">' + htmlStr);
      }
    });
};

function genListOfPlayers(teamID){
  //2015 - 2016 -> 2015-16
  var yearSpanStr = $("#Season option:selected").text();
  var yearID = yearSpanStr.slice(0,4) + "-" + yearSpanStr.slice(-2);
  var playerURL = 'http://stats.nba.com/stats/teamplayerdashboard?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PaceAdjust=N&PerMode=PerGame&Period=0&PlusMinus=N&Rank=N&Season='
  + yearID
  + '&SeasonSegment=&SeasonType=Regular+Season&TeamID='
  + teamID
  + '&VsConference=&VsDivision=';

  $.ajax({
    type: "GET",
    dataType: "jsonp",
    url: playerURL,
    success: function(data) {
      var playerSet = data.resultSets[1].rowSet;
      $("#playerSelection.off-canvas-list").html("");
      var htmlStr = "<option value='' selected='selected' disabled='disabled'> Choose Player </option>";;
      for (var i = 0; i < playerSet.length; i++ ){
        htmlStr = htmlStr.concat('<option value="' + playerSet[i][1] + '">' + playerSet[i][2] + '</option>');

      }
      htmlStr = htmlStr.concat('</select></li>');
      $("#playerSelection.off-canvas-list").append('<li> <select id="PlayerName">' + htmlStr);
    }
  });

}

// as the year change, we should generate a different list of teams
$(document).on('change', '#Season', function(){
  genListOfTeam(this.value);
});

$(document).on('change', '#TeamName', function(){
  genListOfPlayers(this.value);
});

function retreiveNBAData() {
  var patt = /\"resultSets\":\[/i;
  var seasonText = $("#Season option:selected").val();
  var seasonID = seasonText.slice(0,4) + "-" + seasonText.slice(-2);
  //var teamID = $("#TeamName option:selected").val();
  var playerID = $("#PlayerName option:selected").val();
  //console.log(seasonID);
  //console.log(teamID);
  //console.log(playerID);

  var webpage = 'http://stats.nba.com/stats/shotchartdetail?CFID=33&CFPARAMS='
  + seasonID
  + '&ContextFilter=&ContextMeasure=FGA&DateFrom=&DateTo=&GameID=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerID='
  + playerID
  + '&PlusMinus=N&Position=&Rank=N&RookieYear=&Season='
  + seasonID
  + '&SeasonSegment=&SeasonType=Regular+Season&TeamID=0&VsConference=&VsDivision=&mode=Advanced&showDetails=0&showShots=1&showZones=0';


  var bodycontent;
  $.ajax({
    type: "GET",
    dataType: "jsonp",
    url: webpage
  })
    .done(function(data) {
      parseShotData(data);
    });


}


function parseShotData(data){
  var shotList = data.resultSets[0].rowSet;
  var shotListLen = shotList.length;

  // reset zonesMade/Miss array
  for (var i = 0; i < 14; i++){
    zonesMade[i] = 0;
    zonesMiss[i] = 0;
  }

  // going through each one and start doing computation
  for (var i = 0; i < shotListLen; i++){
    var indexX=0;
    var indexY=0;
    // if its a make
    if (shotList[i][10] == 'Made Shot'){
       indexX = Math.round((shotList[i][17]+250 )/10);
       indexY =Math.round((shotList[i][18] + 40)/10);  // add 40 to include the distance from base line to rim

      // for now we won't include shots from back court
       if (indexY >= 47)
        continue;
      zonesMade[PointToZone[indexY][indexX]]++;
    }
    else {
      indexX =  Math.round((shotList[i][17]+250 )/10);
      indexY = Math.round((shotList[i][18] + 40)/10) ; // add 40 to include the distance from base line to rim

      // for now we won't include shots from back court
      if (indexY >= 47)
        continue;

      zonesMiss[PointToZone[indexY][indexX]]++;
    }
  }
  generateZoneColor();

}

function generateZoneColor(){

  for (var i = 0; i < 14; i++){
    var shotPercent = zonesMade[i]/(zonesMade[i] + zonesMiss[i]);
    console.log("zone" + i + ": " + shotPercent);
    console.log("made: " + zonesMade[i] + '/' +   (zonesMade[i]+ zonesMiss[i]));
    console.log("");

    // i don't have the mesh created for these yet
    if ( i > 10)
      continue;

    // red
    if (shotPercent > .50){
      zones[i].material.color.setHex( 0xff0000 );
    }
    // yellow
    else if (shotPercent > .40){
      zones[i].material.color.setHex( 0xffff00 );
    }
    // green
    else if (shotPercent > .30){
      zones[i].material.color.setHex( 0x00cc00 );
    }
    else{
      zones[i].material.color.setHex( 0x00ccff );
    }


  }

  genPercentageText();
}


function genPercentageText(){

  var textCoordX = [380,360,280,360,380,225,180,230,380, 380, 380, 100, 100, 100];
  //var textCoordY = [4,];
  var textCoordZ = [0,120,0,-120,200,120,0,-100,-200, 240, -230, 200, 0, -200];


  for (var i = 0; i < 14; i++){
    if (!FirstTime){
      scene.remove(zonesText[i]);
    }
		var TextGeo = new THREE.TextGeometry( String(zonesMade[i]) + '/' + String(zonesMade[i] + zonesMiss[i]), {
		font:  'helvetiker'
		,height:0
		,size:10
		});
    var textMaterial = new THREE.MeshPhongMaterial({
	     color: 0xdddddd
     });

     zonesText[i] = new THREE.Mesh(TextGeo, textMaterial);
      zonesText[i].position.set(textCoordX[i],10,textCoordZ[i]);
      zonesText[i].rotation.set(-Math.PI/2, 0, 0);
     scene.add(zonesText[i]);
   }

   if (FirstTime)
    FirstTime = false;




  //var textShapes = THREE.FontUtils.generateShapes( text, options );
  //var text = new THREE.ShapeGeometry( textShapes );
  //var textMesh = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ) ;
  //scene.add(textMesh);
}
