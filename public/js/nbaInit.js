var camera, scene, renderer;
var targetlist, mousetargetlist;
var INTERSECTED;
var mouseSphere = []
var sphereToggle = false;
var sprite1;



function retreiveNBAData() {
  var patt = /\"resultSets\":\[/i;
  var webpage = "http://stats.nba.com/stats/shotchartdetail?CFID=33&CFPARAMS=2014-15&ContextFilter=&ContextMeasure=FGA&DateFrom=&DateTo=&GameID=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerID=201939&PlusMinus=N&Position=&Rank=N&RookieYear=&Season=2014-15&SeasonSegment=&SeasonType=Regular+Season&TeamID=0&VsConference=&VsDivision=&mode=Advanced&showDetails=0&showShots=1&showZones=0";
  var bodycontent;
  //$("#div").load(webpage, function (data) {
//    bodycontent = data;
  //  console.log(bodycontent);
  //});
  //var fullParagraph =  $(webpage + " #container").text();

  /*
  $.get(webpage, function(data){
    alert( "Load was performed." );
    console.log(data);
    //$( ".result" ).html( data );
  })
  .done(function() {
    alert( "second success" );
  })
  .fail(function() {
    console.log(webpage);
    alert( "error" );
  })
  */
  $.ajax({
    type: "GET",
    dataType: "jsonp",
    url: 'http://stats.nba.com/stats/shotchartdetail?CFID=33&CFPARAMS=2014-15&ContextFilter=&ContextMeasure=FGA&DateFrom=&DateTo=&GameID=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerID=201939&PlusMinus=N&Position=&Rank=N&RookieYear=&Season=2014-15&SeasonSegment=&SeasonType=Regular+Season&TeamID=0&VsConference=&VsDivision=&mode=Advanced&showDetails=0&showShots=1&showZones=0',
    success: function(data) {
      //$('#result').html(data);
      //var myData = JSON.parse(data);
      var shotList = data.resultSets[0].rowSet;
      var shotListLen = shotList.length;

      // create 2D - array and set all to 0;
      var madeMatrix = new Array(50);
      var missMatrix = new Array(50);
      var percentageMatrix = new Array(50);
      for (var i = 0; i < 50; i++){
        madeMatrix[i] = new Array(94);
        missMatrix[i] = new Array(94);
        percentageMatrix[i] = new Array(94);
        for (var j = 0; j < 94; j++){
          madeMatrix[i][j] = 0;
          missMatrix[i][j] = 0;
        }
      }

      // going through each one and start doing computation
      for (var i = 0; i < shotListLen; i++){
        //console.log(shotList[i][4]+ ", " + shotList[i][10] + ", " +  shotList[i][17] + ", " +  shotList[i][18]);
        // if its a make
        if (shotList[i][10] == 'Made Shot'){
          madeMatrix[ Math.floor((shotList[i][17] + 250)/10)][Math.floor(shotList[i][18]/10)]++;
        }
        else {
          missMatrix[ Math.floor((shotList[i][17] + 250)/10)][Math.floor(shotList[i][18]/10)]++;
        }
      }
      for (var i = 0; i < 50; i++){
        for (var j = 0 ; j < 94; j++){
          var totalShots = madeMatrix[i][j] + missMatrix[i][j];
          if (totalShots == 0){
            percentageMatrix[i][j] = 0;
          }
          else{
            percentageMatrix[i][j] = madeMatrix[i][j] / totalShots;
          }
        }
        console.logs(i + ': ' + percentageMatrix[i]);
      }


  }

  });
}

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


function generateCourt() {
  var tableSelected = $("#TeamName option:selected").val();
  console.log(tableSelected);
  retreiveNBAData();
  //generatePlainCourtTexture();

}

function generatePlainCourtTexture(){

  //scene = new THREE.Scene();
  init();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

	//renderer = new THREE.WebGLRenderer();
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

function onDocumentMouseDown(event) //http://www.moczys.com/webGL/Experiment_02_V05.html
{
  // the following line would stop any other event handler from firing
  // (such as the mouse's TrackballControls)
  //event.preventDefault();
  console.log("Mouse moving!");
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
