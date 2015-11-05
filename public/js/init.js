var camera, scene, renderer
var controls, texts
var effect
var meshes = []
var mouse
var targetlist, mousetargetlist
var INTERSECTED
var INITIAL = false
var intersects = []
var hidecontrols
var graphType
var RENDERID = null
var mouseSphereCoords = null
var mouseSphere=[]

function init() {
  scene = new THREE.Scene();
  window.addEventListener('resize', onWindowResize, false);
  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  mouse = { x: 0, y: 0 };
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false );
  $('.visual').append(renderer.domElement);
}



$("#VisualList").change(function() {
  var tableSelected = $("#VisualList option:selected").val();
  switch (tableSelected) {
    case 'bar':
      break;
    case 'scatter':
      break;
    default:
      break;
  }

});

// table selected, time to show columns
$("#TableList").change(function() {
  var tableSelected = $("#TableList option:selected").val();
  var getColumnTypeQuery = "SELECT column_name ,data_type FROM information_schema.columns where table_name = '";
  getColumnTypeQuery = getColumnTypeQuery.concat(tableSelected + "'");
  console.log(getColumnTypeQuery);

  $("#filters.off-canvas-submenu").html("");
  $.getJSON('/retrieveData', {
    myQuery: getColumnTypeQuery
  }, function(data) {
    // create a dropdown list


    var htmlStr = '';
    //$("#filters.off-canvas-submenu").append('<li><select>');

    // populate dropdown list with columnNames and Values
    for (var i = 0; i < data.length; i++) {
      //$("#filters.off-canvas-submenu").append('<option value="' + data[i].data_type + '">' + data[i].column_name + '</option>');
      htmlStr = htmlStr.concat('<option value="' + data[i].data_type + '">' + data[i].column_name + '</option>');
    }


    //$.each(data, function(j, g){

    //});
    htmlStr = htmlStr.concat('</select></li>');
    $("#filters.off-canvas-submenu").append('<li><select id="x">' + htmlStr);
    $("#filters.off-canvas-submenu").append('<li><select id="y">' + htmlStr);
    $("#filters.off-canvas-submenu").append('<li><select id="z">' + htmlStr);

  });




});


function displayVisuals() {
  var dropDownSelected = $("#VisualList option:selected").val();
  var tableSelected = $("#TableList option:selected").val();


}

function generateBarFilters() {
  // initialize Column Selection



  //Columns for X


  //Columns for Y


  //Columns for Z
}

function generateVisuals() {
  var tableSelected = $("#VisualList option:selected").val();
  switch (tableSelected) {
    case 'bar':
      generateBar();
      graphType = 'bar'
      break;
    case 'scatter':
      generateScatter();
      graphType = 'scatter'
      break;
    default:
      break;
  }
}

//Xinglun Xu add generateScatter function here
function generateScatter() {
  clearmeshes();
  if (!INITIAL) {
    init();
    INITIAL = true;
     //mouse sphere
    var msphere= new THREE.Mesh(new THREE.SphereGeometry(0.1,8,8), new THREE.MeshBasicMaterial({ color: 0xf9f9f9 }));
    scene.add(msphere);
    mouseSphere.push(msphere);
  }
  if (RENDERID != null)
    cancelAnimationFrame( RENDERID );
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);

  //add effect
  effect = new THREE.StereoEffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  targetlist = [];
  mousetargetlist = [];
  texts = [];
  setupScene();
  var geometry = new THREE.SphereGeometry(0.25, 32, 32);
  var material = new THREE.MeshBasicMaterial({
    color: 0xffff00
  });
  var normalMaterial = new THREE.MeshNormalMaterial();
  var tableSelected = $("#TableList option:selected").val();
  var x = $("#x option:selected").text();
  var y = $("#y option:selected").text();
  var z = $("#z option:selected").text();
  var getColumnTypeQuery = "SELECT " + x + ", " + y + ", " + z + " from " + tableSelected;
  console.log(getColumnTypeQuery);
  // console.log("generateScatter: "+x+" "+y+" "+z);
  $.getJSON('/retrieveData', {
    myQuery: getColumnTypeQuery
  }, function(data) {
    test = data;
    displayNodes(data, geometry, material, x, y, z);
  });
  drawNumbers(new THREE.Vector3(0, 5.1, 0), new THREE.Vector3(1, 0, 0), 1, 7, texts);
  drawText(x, 6, 0, 0, texts);
  drawText(y, 0, 6, 0, texts);
  drawText(z, 0, 0, 6, texts);
  window.addEventListener('resize', onWindowResize, false);

  renderScatter();
  // console.log("generateScatter is called");
}

function generateBar() {
  clearmeshes();

  if (!INITIAL) {
    init();
    INITIAL = true;
     //mouse sphere
    var msphere= new THREE.Mesh(new THREE.SphereGeometry(8,8,8), new THREE.MeshBasicMaterial({ color: 0xf9f9f9 }));
    scene.add(msphere);
    mouseSphere.push(msphere);

  }
  if (RENDERID != null)
    cancelAnimationFrame( RENDERID );
  initbars();
  animate();

  targetlist = [];
  mousetargetlist = [];

  var tableSelected = $("#TableList option:selected").val();
  var x = $("#x option:selected").text();
  var y = $("#y option:selected").text();
  var z = $("#z option:selected").text();

  var getColumnTypeQuery = "SELECT " + x + ", " + y + ", " + z + " from " + tableSelected;
  console.log(getColumnTypeQuery);
  var test;
  $.getJSON('/retrieveData', {
    myQuery: getColumnTypeQuery
  }, function(data) {
    test = data;
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
  mouse.x = ( ( event.clientX - $('.visual').offset().left ) / renderer.domElement.width ) * 2 - 1;
  mouse.y = -( ( event.clientY - $('.visual').offset().top + document.body.scrollTop) / renderer.domElement.height ) * 2 + 1;
  vector = new THREE.Vector3(mouse.x, mouse.y, 0.1);

  var raycaster = new THREE.Raycaster();
  var dir = new THREE.Vector3(mouse.x, mouse.y, 0.1);

  if (camera instanceof THREE.OrthographicCamera) { //KEY BRANCH CONDITION: checks if ortha or prespetive
    vector.set(((event.clientX - $('.visual').offset().left ) / window.innerWidth) * 2 - 1, -((event.clientY - $('.visual').offset().top + document.body.scrollTop) / window.innerHeight) * 2 + 1, -1); // z = - 1 important!
    vector.unproject(camera);
    dir.set(0, 0, -1).transformDirection(camera.matrixWorld);
    raycaster.set(vector, dir);
  } else if (camera instanceof THREE.PerspectiveCamera) {
    vector.set(((event.clientX - $('.visual').offset().left ) / window.innerWidth) * 2 - 1, -((event.clientY - $('.visual').offset().top + document.body.scrollTop) / window.innerHeight) * 2 + 1, 0.5); // z = 0.5 important!
    vector.unproject(camera);
    raycaster.set(camera.position, vector.sub(camera.position).normalize());
  }

  var intersects = raycaster.intersectObjects(targetlist, true);
  var temp = 0;
  var coeff = 0.5;

  if (intersects.length > 0) { // case if mouse is not currently over an object
    if (INTERSECTED == null) {
      INTERSECTED = intersects[0];
      tmpColor = INTERSECTED.object.material.color;
      temp = INTERSECTED.object.material.color
      INTERSECTED.object.material.color = new THREE.Color((temp.r + Math.max(0.35 - temp.r, 0)) * coeff, (temp.g + Math.max(0.35 - temp.g, 0)) * coeff, (temp.b + Math.max(0.35 - temp.b, 0)) * coeff);

    } else { // if thse mouse is over an object
      INTERSECTED.object.material.color = tmpColor;
      INTERSECTED.object.geometry.colorsNeedUpdate = true;
      INTERSECTED = intersects[0];
      tmpColor = INTERSECTED.object.material.color;
      temp = INTERSECTED.object.material.color
      INTERSECTED.object.material.color = new THREE.Color((temp.r + Math.max(0.35 - temp.r, 0)) * coeff, (temp.g + Math.max(0.35 - temp.g, 0)) * coeff, (temp.b + Math.max(0.35 - temp.b, 0)) * coeff);
    }
    INTERSECTED.object.geometry.colorsNeedUpdate = true;

  } else // there are no intersections
  {
    // restore previous intersection object (if it exists) to its original color
    if (INTERSECTED) {
      INTERSECTED.object.material.color = tmpColor;
      INTERSECTED.object.geometry.colorsNeedUpdate = true;
    }
    // remove previous intersection object reference
    //     by setting current intersection object to "nothing"

    INTERSECTED = null;

  }
  }

 function onDocumentMouseMove( event ) //http://www.moczys.com/webGL/Experiment_02_V05.html
 {
  mouse.x = ( ( event.clientX - $('.visual').offset().left ) / renderer.domElement.width ) * 2 - 1;
  mouse.y = -( ( event.clientY - $('.visual').offset().top + document.body.scrollTop) / renderer.domElement.height ) * 2 + 1;
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.1);

  var raycaster = new THREE.Raycaster();
  var dir = new THREE.Vector3(mouse.x, mouse.y, 0.1);

  if (camera instanceof THREE.OrthographicCamera) { //KEY BRANCH CONDITION: checks if ortha or prespetive
    vector.set(((event.clientX - $('.visual').offset().left ) / window.innerWidth) * 2 - 1, -((event.clientY - $('.visual').offset().top + document.body.scrollTop) / window.innerHeight) * 2 + 1, -1); // z = - 1 important!
    vector.unproject(camera);
    dir.set(0, 0, -1).transformDirection(camera.matrixWorld);
    raycaster.set(vector, dir);
  } else if (camera instanceof THREE.PerspectiveCamera) {
    vector.set(((event.clientX - $('.visual').offset().left ) / window.innerWidth) * 2 - 1, -((event.clientY - $('.visual').offset().top + document.body.scrollTop) / window.innerHeight) * 2 + 1, 0.5); // z = 0.5 important!
    vector.unproject(camera);
    raycaster.set(camera.position, vector.sub(camera.position).normalize());
  }

  var intersects = raycaster.intersectObjects(mousetargetlist, true);

    if ( intersects.length > 0 )  {
      mouseSphereCoords = [intersects[0].point.x, intersects[0].point.y, intersects[0].point.z];
    } 
    else {
      mouseSphereCoords = null;
    }
}
 
function CheckMouseSphere(){
 // if the coordinates exist, make the sphere visible
 if(mouseSphereCoords != null){
   mouseSphere[0].position.set(mouseSphereCoords[0],mouseSphereCoords[1],mouseSphereCoords[2]);
   mouseSphere[0].visible = true;
 }
 else{
   mouseSphere[0].visible = false;
  }
 }

