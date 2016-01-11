var camera, scene, renderer
var controls, texts
var effect
var meshes = []
var targetlist
var INTERSECTED
var INITIAL = false
var hidecontrols
var graphType
var RENDERID = null
var mouseSphere = []
var sphereToggle = false;
var sprite1;
var canvas1, context1, texture1;

function init() {
  scene = new THREE.Scene();
  window.addEventListener('resize', onWindowResize, false);
  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  $('.visual').append(renderer.domElement);
  sphereToggle = false;

  canvas1 = document.createElement('canvas'); //canvas for text popup
  context1 = canvas1.getContext('2d');

  texture1 = new THREE.Texture(canvas1); //texture for canvas
  texture1.needsUpdate = true;
}

$("#sphere").change(function() {
  if (this.checked)
    sphereToggle = true;
  else {
    sphereToggle = false;
  }
})

function generateVisuals() {
  var tableSelected = $("#VisualList option:selected").val();
  switch (tableSelected) {
    case 'bar':
      graphType = 'bar';
      generateBar();
      break;
    case 'scatter':
      graphType = 'scatter';
      generateScatter();
      break;
    default:
      break;
  }
}



//generate objects on scatter plot and render
function generateScatter() {
  clearmeshes();
  if (RENDERID != null)
    cancelAnimationFrame(RENDERID);
  if (!INITIAL) {
    init();
    INITIAL = true;
    //mouse sphere
    var msphere = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({
      color: 0xf9f9f9
    }));
    msphere.visible = false;
    scene.add(msphere);
    mouseSphere.push(msphere);
  }
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
  //add effect
  effect = new THREE.StereoEffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  targetlist = [];
  mousetargetlist = [];
  texts = [];
  var scales = [];
  setupScene();
  var normalMaterial = new THREE.MeshNormalMaterial();
  var x = $("#xColumn option:selected").text();
  var y = $("#yColumn option:selected").text();
  var z = $("#zColumn option:selected").text();
  var getColumnTypeQuery = BarScatterFilterQuery();
  $.getJSON('/retrieveData', {
    myQuery: getColumnTypeQuery
  }, function(data) {
    findScales(scales, data, x, y, z);
    displayNodes(data, x, y, z, scales);
    drawNumbers(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), 1, 7, texts, scales[0]);
    drawNumbers(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 1, 7, texts, scales[1]);
    drawNumbers(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1), 1, 7, texts, scales[2]);
  });
  drawText(x, 6, 0, 0, texts);
  drawText(y, 0, 6, 0, texts);
  drawText(z, 0, 0, 6, texts);

  renderScatter();
}




function generateBar() {
  clearmeshes();
  if (RENDERID != null)
    cancelAnimationFrame(RENDERID);

  if (!INITIAL) {
    init();
    INITIAL = true;
    //mouse sphere
    var msphere = new THREE.Mesh(new THREE.SphereGeometry(8, 8, 8), new THREE.MeshBasicMaterial({
      color: 0xf9f9f9
    }));
    msphere.visible = false;
    scene.add(msphere);
    mouseSphere.push(msphere);

  }
  initbars();
  animate();

  targetlist = [];
  mousetargetlist = [];
  scater_check = 0;
  var tableSelected = $("#TableList option:selected").val();
  var x = $("#x option:selected").text();
  var y = $("#y option:selected").text();
  var z = $("#z option:selected").text();


  // generate bar/Scatter Query Based on Filters

  var displayQuery = BarScatterFilterQuery();
  var test;
  $.getJSON('/retrieveData', {
    myQuery: displayQuery
  }, function(data) {
    renderData(data);
  });

}


function clearmeshes() {
  for (var i = 0; i < meshes.length; i++) {
    scene.remove(meshes[i]);
  }
  meshes = [];
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


function onDocumentMouseDown(event) //http://www.moczys.com/webGL/Experiment_02_V05.html
{
  // the following line would stop any other event handler from firing
  // (such as the mouse's TrackballControls)
  //event.preventDefault();

  // update the mouse variable
  var mouse = {
    x: ((event.clientX - $('.visual').offset().left) / renderer.domElement.width) * 2 - 1,
    y: -((event.clientY - $('.visual').offset().top + document.body.scrollTop) / renderer.domElement.height) * 2 + 1
  };

  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.1);
  var raycaster = new THREE.Raycaster();
  var dir = new THREE.Vector3(mouse.x, mouse.y, 0.1);

  if (camera instanceof THREE.OrthographicCamera) { //KEY BRANCH CONDITION: checks if ortha or prespetive
    vector.set(((event.clientX - $('.visual').offset().left) / window.innerWidth) * 2 - 1, -((event.clientY - $('.visual').offset().top + document.body.scrollTop) / window.innerHeight) * 2 + 1, -1); // z = - 1 important!
    vector.unproject(camera);
    dir.set(0, 0, -1).transformDirection(camera.matrixWorld);
    raycaster.set(vector, dir);
  } else if (camera instanceof THREE.PerspectiveCamera) {
    vector.set(((event.clientX - $('.visual').offset().left) / window.innerWidth) * 2 - 1, -((event.clientY - $('.visual').offset().top + document.body.scrollTop) / window.innerHeight) * 2 + 1, 0.5); // z = 0.5 important!
    vector.unproject(camera);
    raycaster.set(camera.position, vector.sub(camera.position).normalize());
  }

  var intersects = raycaster.intersectObjects(targetlist, true);
  var temp = 0;
  var coeff = 1.1;
  var mouseSphereCoords;

  if (intersects.length > 0) { // case if mouse is not currently over an object
    mouseSphereCoords = [intersects[0].point.x, intersects[0].point.y, intersects[0].point.z];
    if (INTERSECTED == null) {
      INTERSECTED = intersects[0];
      tmpColor = INTERSECTED.object.material.color;
      temp = INTERSECTED.object.material.color
      INTERSECTED.object.material.color = new THREE.Color((temp.r + Math.max(0.4 - temp.r, 0)) * coeff, (temp.g + Math.max(0.4 - temp.g, 0)) * coeff, (temp.b + Math.max(0.4 - temp.b, 0)) * coeff);
        // POP UP TEXT, must create new sprite each time, updating did not work
        updateTextSprite(intersects)


    } else { // if thse mouse is over an object
      INTERSECTED.object.material.color = tmpColor;
      INTERSECTED.object.geometry.colorsNeedUpdate = true;
      INTERSECTED = intersects[0];
      tmpColor = INTERSECTED.object.material.color;
      temp = INTERSECTED.object.material.color
      INTERSECTED.object.material.color = new THREE.Color((temp.r + Math.max(0.4 - temp.r, 0)) * coeff, (temp.g + Math.max(0.4 - temp.g, 0)) * coeff, (temp.b + Math.max(0.4 - temp.b, 0)) * coeff);
        // POP UP TEXT, must create new sprite each time, updating did not work
        updateTextSprite(intersects)
    }

    INTERSECTED.object.geometry.colorsNeedUpdate = true;

  } else // there are no intersections
  {
    mouseSphereCoords = null;
    // restore previous intersection object (if it exists) to its original color
    if (INTERSECTED) {
      INTERSECTED.object.material.color = tmpColor;
      INTERSECTED.object.geometry.colorsNeedUpdate = true;
      sprite1.position.set(event.clientX + 9999, event.clientY + 999, 0); //moves sprite away from screen when not clicked on

    }
    // remove previous intersection object reference
    //     by setting current intersection object to "nothing"
  }
  if (sphereToggle)
    CheckMouseSphere(mouseSphereCoords);

}

function CheckMouseSphere(mouseSphereCoords) {
  // if the coordinates exist, make the sphere visible
  if (mouseSphereCoords != null) {
    mouseSphere[0].position.set(mouseSphereCoords[0], mouseSphereCoords[1], mouseSphereCoords[2]);
    mouseSphere[0].visible = true;
  } else {
    mouseSphere[0].visible = false;
  }
}

function updateTextSprite(intersects){
  scene.remove(sprite1);
  /*
  var resultx = Math.round(intersects[0].object.position.x * 100) / 100
  var resulty = Math.round(intersects[0].object.position.y * 100) / 100
  var resultz = Math.round(intersects[0].object.position.z * 100) / 100
  */
  var resultx = intersects[0].object.data[0];
  var resulty = intersects[0].object.data[1];
  var resultz = intersects[0].object.data[2];

  var msg = "X:" + resultx + '\n' + "Y:" + resulty + '\n' + "Z:" + resultz;
  canvas1 = document.createElement('canvas');
  canvas1.width = 512;
  canvas1.height = 256;
  context1.clearRect(0, 0, 100, 100);
  context1 = canvas1.getContext('2d');
  context1.font = "Bold 30px Arial";
  var metrics = context1.measureText(msg);
  var width = metrics.width;
  context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
  context1.fillRect(0, 0, width + 16, 20 + 16);
  context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
  context1.fillRect(2, 2, width + 16, 20 + 16);
  context1.fillStyle = "rgba(0,0,0,1)"; // text color
  context1.fillText(msg, 10, 30);
  texture1.needsUpdate = true;

  texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;

  var spriteMaterial = new THREE.SpriteMaterial({
    map: texture1,
    color: 0xffffff,
    fog: true
  });
  sprite1 = new THREE.Sprite(spriteMaterial);

  if (graphType === 'bar') { //check if scatter or bar, adjusts sprite parameters
    sprite1.scale.set(300, 200, 1)
    sprite1.position.set(50, 50, 0);
    scene.add(sprite1);
    //need to work on putting sprite on a new scene, so other bars wont block the sprite
    // this will also fix the issue with positioning, right now i position it so sprite is above all other bars
    sprite1.position.set(intersects[0].object.position.x, intersects[0].object.position.y + 150, intersects[0].object.position.z); //update sprite position
  } else {
    sprite1.scale.set(3, 2, 1)
    sprite1.position.set(50, 50, 0);
    scene.add(sprite1);
    sprite1.position.set(intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z); //update sprite position
  }
}
