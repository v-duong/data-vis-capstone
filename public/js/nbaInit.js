var camera, scene, renderer, effect;
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
var zonesTextPerc = new Array(14);
var FirstTime = true;



function generateNBACourt() {
/*
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
*/


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
  effect = new THREE.StereoEffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);
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


function generateZones(){
  if (FirstTime){
    var zone4and8 = genZone4and8();
    zones[0] = genZone0();
    zones[1] = genZone1();
    zones[2] = genZone2();
    zones[3] = genZone3();
    zones[4] = zone4and8[0];
    zones[5] = genZone5();
    zones[6] = genZone6();
    zones[7] = genZone7();
    zones[8] = zone4and8[1];
    zones[9] = genZone9();
    zones[10] = genZone10();
    //zones[11] = genZone11();
    //zones[12] = genZone12();
    //zones[13] = genZone13();


    for (var i = 0; i < 11; i++){
      scene.add(zones[i]);
    }

  }
};

function animate() {
  RENDERID = requestAnimationFrame(animate);
  render();
}

function render() {
    if (vrModeIsOn) {
      effect.render(scene, camera);
    } else {
      renderer.render(scene, camera);
    }
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
  //generateZoneColor();
  generateZoneColor(zonesMade, zonesMiss, zones);
  genPercentageText(zonesMade, zonesMiss, zones);
}
/*
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
*/

function genPercentageText(){

  var textCoordX = [380,360,280,360,380,225,190,230,380, 380, 380, 100, 100, 100];
  //var textCoordY = [4,];
  var textCoordZ = [0,  120,0, -120,180,120,0, -100,-190,238,-240, 200, 0,  -200];
  //var textCoordZPerc = [0,120,0,-120,200,120,0,-100,-200, 240, -230, 200, 0, -2];

  for (var i = 0; i < 14; i++){
    if (!FirstTime){
      scene.remove(zonesText[i]);
      scene.remove(zonesTextPerc[i]);
    }
		var TextGeo = new THREE.TextGeometry( String(zonesMade[i]) + '/' +
                                          String(zonesMade[i] + zonesMiss[i]) , {
		font:  'helvetiker'
		,height:0
		,size:10
		});
    var TextGeoPerc = new THREE.TextGeometry( String(((zonesMade[i]/(zonesMade[i]+zonesMiss[i]))*100).toFixed(2)) + '%', {
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
