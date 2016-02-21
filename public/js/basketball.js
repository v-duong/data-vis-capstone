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

var zones = new Array(14);
var zonesText = new Array(14);
var zonesTextPerc = new Array(14);
var FirstTime = true;
var backboard;
var court;


function initbasketball() {


  orbit_persp_camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
  device_persp_camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera = orbit_persp_camera;

  renderer.setSize(window.innerWidth, window.innerHeight);

  //add effect
  effect = new THREE.StereoEffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  orbit_persp_controls = new THREE.OrbitControls(orbit_persp_camera, renderer.domElement);
  //        controls.damping = 0.2;
  device_persp_controls = new THREE.DeviceOrientationControls(device_persp_camera);
  //hidecontrols = new THREE.OrbitControls(hideCamera, renderer.domElement);
  //        controls.damping = 0.2;
  controls = orbit_persp_controls;

  if (!INITIAL) {
    orbit_persp_controls.addEventListener('change', render);
    device_persp_controls.addEventListener('change', render);
  }

  orbit_persp_controls.enabled = false;
  device_persp_controls.enabled = false;
  controls.enabled = true;
}

 var renderBasketball = function () {
  RENDERID = requestAnimationFrame(renderBasketball);
  if (vrModeIsOn) {
    if (isMobile){
        effect.render(scene, device_persp_camera);
      } else {
        effect.render(scene, orbit_persp_camera);
      }
    }
    else {
      renderer.render(scene, orbit_persp_camera);
    }
  controls.update();
}

function clearBasketballMesh(){
  for (var i = 0; i < 14; i++){
    if ((zones[i] != null) && (zones[i] != undefined)){
      scene.remove(zones[i]);
    }
    if ((zonesText[i] != null) && (zonesText[i] != undefined)){
      scene.remove(zonesText[i]);
      scene.remove(zonesTextPerc[i]);
    }
  }
  if ((court != null) && (court != undefined)){
    scene.remove(court);
  }
  if ((backboard != null) && (backboard != undefined)){
    scene.remove(backboard);
  }
  FirstTime = true;
}
// create floor and backboard
function genCourt(){
  var geometry = new THREE.BoxGeometry( 940, 2, 500 );
	var material = new THREE.MeshBasicMaterial( { map : THREE.ImageUtils.loadTexture("static/img/basketball_court.png")} );
	court = new THREE.Mesh( geometry, material );

  var backboardMaterial = new THREE.MeshBasicMaterial ( {map : THREE.ImageUtils.loadTexture("static/img/backboard.jpg")} );


  backboard = new THREE.Mesh(
    new THREE.BoxGeometry( 60, 35, 3),
    backboardMaterial );
  backboard.position.set(450,100,0);
  backboard.__dirtyPosition = true;
  backboard.rotation.set(0, Math.PI/2,0);
  //backboard.__dirtyRotation = true;

	scene.add( court );
  scene.add( backboard );

}

function generateZones(){
  if (FirstTime){
    genZone0();
    genZone1();
    genZone2();
    genZone3();
    genZone4and8();
    genZone5();
    genZone6();
    genZone7();
    genZone9();
    genZone10();
    genZone11and13();
    genZone12();

  }
};



function genZone10(){
  // geometry
  var geo = new THREE.Geometry();
  geo.vertices.push( new THREE.Vector3( 0+329, 4, 0-250 ) );
  geo.vertices.push( new THREE.Vector3( 140+329, 4, 0-250 ) );
  geo.vertices.push( new THREE.Vector3( 140+329, 4, 26-250 ) );
  geo.vertices.push( new THREE.Vector3( 0+329, 4, 26-250 ) ); // close the loop
  geo.faces.push(new THREE.Face3(0,1,2));
  geo.faces.push(new THREE.Face3(0,2,3));

  var material = new THREE.MeshBasicMaterial({
    //color: 0x0000ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });

  var mymesh = new THREE.Mesh( geo, material );
  //scene.add( mymesh);
  zones[10] = mymesh;
  scene.add(mymesh);
  //return mymesh;
}
function genZone9(){
  var geo = new THREE.Geometry();
  geo.vertices.push( new THREE.Vector3( 0+329, 4, 4+220 ) );
  geo.vertices.push( new THREE.Vector3( 140+329, 4, 4+220 ) );
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
  var mymesh = new THREE.Mesh( geo, material );

  zones[9] = mymesh;
  scene.add(mymesh);
  //return mymesh;


}
function genZone0(){
  var geometry = new THREE.CircleGeometry(86.5, 30, 60/180*Math.PI,240/180*Math.PI);
  geometry.faces.push(new THREE.Face3(0,1,31));

  var material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  var mymesh = new THREE.Mesh(geometry, material);

  mymesh.rotation.set(Math.PI/2, 0, 0);
  mymesh.position.set(425,2,0);
  mymesh.__dirtyPosition = true;

  //return mymesh;
  zones[0] = mymesh;
  scene.add(mymesh);
}

function genZone1(){
    var geometry = new THREE.RingGeometry( 87.5, 167.5, 16, 2, 75/180 * Math.PI, 80/180 * Math.PI);
    geometry.vertices.push(new THREE.Vector3(43.352,76.0056,0));
    var geoLen = geometry.vertices.length;
    geometry.faces.push(new THREE.Face3(0,34,geoLen-1));
    var material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
  //  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var mymesh = new THREE.Mesh(geometry, material);

    //mymesh.rotation.set(Math.PI/2, 0,Math.PI/2.4);
    mymesh.rotation.set(Math.PI/2, 0, 0);
    mymesh.position.set(425,2,0);
    //mymesh.position.set(0,2,0);
    mymesh.__dirtyPosition = true;

    //return mymesh;
    zones[1] = mymesh;
    scene.add(mymesh);
}
function genZone2(){
  var geometry = new THREE.RingGeometry( 87.5, 167.5, 16, 2, 0, 49/180 * Math.PI);

  var material = new THREE.MeshBasicMaterial({
    //color: 0xfff000,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
//  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  var mymesh = new THREE.Mesh(geometry, material);

  mymesh.rotation.set(Math.PI/2, 0,(2*Math.PI/2.32));
  mymesh.position.set(425,2,0);
  mymesh.__dirtyPosition = true;


  zones[2] = mymesh;
  scene.add(mymesh);
  //return mymesh;
}
function genZone3(){
  var geometry = new THREE.RingGeometry( 87.5, 167.5, 16, 2, 75/180 * Math.PI, 80/180 * Math.PI);
  geometry.vertices.push(new THREE.Vector3(43.352,76.0056,0));
  var geoLen = geometry.vertices.length;
  geometry.faces.push(new THREE.Face3(0,34,geoLen-1));

  var material = new THREE.MeshBasicMaterial({
    //color: 0x00fff0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });

  var mymesh = new THREE.Mesh(geometry, material);

  mymesh.rotation.set(-Math.PI/2, 0,0);
  mymesh.position.set(425,2,0);
  mymesh.__dirtyPosition = true;

  zones[3] = mymesh;
  scene.add(mymesh);
  //return mymesh;

}
function genZone11and13(){
  var curve = new THREE.ArcCurve(
    0, 0,             // ax, aY
    240,            // xRadius, yRadius
    8*Math.PI/9, 0.61*Math.PI, // aStartAngle, aEndAngle
    true             // aClockwise
  );

  var points = curve.getSpacedPoints(20);
  var path = new THREE.Path();
  var geometry = path.createGeometry(points);
  geometry.vertices.push( new THREE.Vector3( -81, 250, 0 ) );
  geometry.vertices.push( new THREE.Vector3( -410, 250, 0 ) );
  geometry.vertices.push( new THREE.Vector3( -410, 115, 0 ) );
  geometry.faces.push(new THREE.Face3(20,21,22));
  for (var i = 0; i < 20; i++){
    geometry.faces.push(new THREE.Face3(i,i+1,22));
  }
  geometry.faces.push(new THREE.Face3(0,22,23));

  var material = new THREE.MeshBasicMaterial({
    //color: 0x0ffcc0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  var material2 = new THREE.MeshBasicMaterial({
    //color: 0x0ffcc0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  var mymesh = new THREE.Mesh(geometry, material);
  mymesh.rotation.set(-Math.PI/2, 0,0);
  mymesh.position.set(410,4,0);
  //mymesh.__dirtyPosition = true;


  var mymesh2 = new THREE.Mesh(geometry, material2);
  mymesh2.rotation.set(Math.PI/2, 0, 0);
  mymesh2.position.set(410,4,0);
  mymesh2.__dirtyPosition = true;

  zones[11] = mymesh2;
  scene.add(mymesh2);

  zones[13] = mymesh;
  scene.add(mymesh);
}

function genZone12(){
  var curve = new THREE.ArcCurve(
    0, 0,             // ax, aY
    240,            // xRadius, yRadius
    -8.03*Math.PI/9, 8.03*Math.PI/9, // aStartAngle, aEndAngle
    true             // aClockwise
  );

  var points = curve.getSpacedPoints(20);
  var path = new THREE.Path();
  var geometry = path.createGeometry(points);
  geometry.vertices.push(new THREE.Vector3(-410,113,0));
  geometry.vertices.push( new THREE.Vector3( -410, -113, 0 ) );
  geometry.faces.push(new THREE.Face3(20,21,22));
  for (var i = 0; i < 20; i++){
    geometry.faces.push(new THREE.Face3(i,i+1,22));
  }

  var material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  var material2 = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  var mymesh = new THREE.Mesh(geometry, material);
  mymesh.rotation.set(-Math.PI/2, 0,0);
  mymesh.position.set(410,4,0);

  zones[12] = mymesh;
  scene.add(mymesh);
}

//87.5, 167.5, 16, 2, 0, 80/180 * Math.PI
function genZone4and8(){
  var curve = new THREE.ArcCurve(
    0, 0,             // ax, aY
    168,            // Radius
    0.665  * Math.PI,  0.42*Math.PI, // aStartAngle, aEndAngle
    true             // aClockwise
  );

  var points = curve.getSpacedPoints(20);
  var path = new THREE.Path();
  var geometry = path.createGeometry(points);
  geometry.vertices.push(new THREE.Vector3(47,220,0));
  geometry.vertices.push(new THREE.Vector3(-93,220,0));
  geometry.vertices.push(new THREE.Vector3(-120,210,0));
  //geometry.vertices.push( new THREE.Vector3( 135, 125, 0 ) );
  //geometry.vertices.push(new THREE.Vector3(135, -15, 0));
  //geometry.vertices.push(new THREE.Vector3(75, -15, 0));
  geometry.faces.push(new THREE.Face3(0,21,22));
  for (var i = 0; i < 20; i++){
    geometry.faces.push(new THREE.Face3(i,i+1,21));
  }
  geometry.faces.push(new THREE.Face3(0,22,23));

  var material = new THREE.MeshBasicMaterial({
    //color: 0x0ffcc0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  var material2 = new THREE.MeshBasicMaterial({
    //color: 0x0ffcc0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  //zones[4] = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x0f00ff}));
  var mymesh = new THREE.Mesh(geometry, material);
  mymesh.rotation.set(-Math.PI/2, 0,0);
  mymesh.position.set(422.5,4,0);
  mymesh.__dirtyPosition = true;
  //scene.add(zones[4]);

  //zone 5
  var mymesh2 = new THREE.Mesh(geometry, material2);
  mymesh2.rotation.set(Math.PI/2, 0, 0);
  mymesh2.position.set(422.5,4,0);
  mymesh2.__dirtyPosition = true;
  //scene.add(zones[8]);
  //return [mymesh2, mymesh];
  zones[4] = mymesh;
  scene.add(mymesh);
  zones[8] = mymesh2;
  scene.add(mymesh2);
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
  var mymesh = new THREE.Mesh(geometry, material);

  mymesh.rotation.set(Math.PI/2, 0,(2*Math.PI/3));
  mymesh.position.set(425,2,0);
  mymesh.__dirtyPosition = true;

  zones[5] = mymesh;
  scene.add(mymesh);
  //return mymesh;
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
  var mymesh = new THREE.Mesh(geometry, material);

  mymesh.rotation.set(Math.PI/2, 0,(Math.PI/1.125));
  mymesh.position.set(425,2,0);
  mymesh.__dirtyPosition = true;

  zones[6] = mymesh;
  scene.add(mymesh);
  //return mymesh;
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
  var mymesh = new THREE.Mesh(geometry, material);

  mymesh.rotation.set(Math.PI/2, 0,(Math.PI/.9));
  mymesh.position.set(425,2,0);
  mymesh.__dirtyPosition = true;

  zones[7] = mymesh;
  scene.add(mymesh);
  //return mymesh;
}


function generateZoneColor(zoneMadeList, zoneMissList){
  var zoneList = zones;
  for (var i = 0; i < 14; i++){
    var shotPercent = zoneMadeList[i]/(zoneMadeList[i] + zoneMissList[i]);

    // green
    if (shotPercent > 0.50){
      zoneList[i].material.color.setHex( 0x00cc00 );
    }
    // yellow
    else if (shotPercent > 0.40){
      zoneList[i].material.color.setHex( 0xffff00 );
    }
    // orange
    else if (shotPercent > 0.30){
      zoneList[i].material.color.setHex( 0xff9900 );
    }
    //red
    else{
      zoneList[i].material.color.setHex( 0xff0000 );
    }


  }

}

function genPercentageText(zoneMadeList, zoneMissList){

  var textCoordX = [380,360,280,360,380,225,190,230,380, 380, 380, 100, 100, 100];
  //var textCoordY = [4,];
  var textCoordZ = [0,  120,0, -120,180,120,0, -100,-190,238,-240, 200, 0,  -200];
  //var textCoordZPerc = [0,120,0,-120,200,120,0,-100,-200, 240, -230, 200, 0, -2];

  for (var i = 0; i < 14; i++){
    if (!FirstTime){
      scene.remove(zonesText[i]);
      scene.remove(zonesTextPerc[i]);
    }
		var TextGeo = new THREE.TextGeometry( String(zoneMadeList[i]) + '/' +
                                          String(zoneMadeList[i] + zoneMissList[i]) , {
		font:  'helvetiker'
		,height:0
		,size:10
		});
    var shotPercentage = 0;
    if (zoneMadeList[i]+zoneMissList[i]){
      shotPercentage = ((zoneMadeList[i]/(zoneMadeList[i]+zoneMissList[i])) * 100).toFixed(2);
    }
    var TextGeoPerc = new THREE.TextGeometry( String(shotPercentage) + '%', {
		font:  'helvetiker'
		,height:0
		,size:10
		});
    var textMaterial = new THREE.MeshPhongMaterial({
	     color: 0xdddddd
     });

     zonesText[i] = new THREE.Mesh(TextGeo, textMaterial);
      zonesText[i].position.set(textCoordX[i],10,textCoordZ[i] );
      zonesText[i].rotation.set(-Math.PI/2, 0, 0);

      zonesTextPerc[i] = new THREE.Mesh(TextGeoPerc, textMaterial);
       zonesTextPerc[i].position.set(textCoordX[i],10,textCoordZ[i]+15);
       zonesTextPerc[i].rotation.set(-Math.PI/2, 0, 0);

     scene.add(zonesText[i]);
     scene.add(zonesTextPerc[i]);
   }

   if (FirstTime)
    FirstTime = false;

}
