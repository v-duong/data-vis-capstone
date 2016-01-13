var camera, scene, renderer;
var targetlist, mousetargetlist;
var INTERSECTED;
var mouseSphere = []
var sphereToggle = false;
var court;
var INITIAL = false

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
  }*/

  buildingCourtZones();
  //retreiveNBAData();
  //generatePlainCourtTexture();

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

function buildingCourtZones(){
  /*var locMapToZone = new Array(50);
  for ( var i = 0; i < 50; i++){
    locMapToZone[i] = new Array(47);
  }

  for (var i = 0; i < 50; i++){
    for (var j = 0; j < 47; j++){
      locMapToZone[i][j] = convertPointToZone(i,j);
    }
  }*/

  var output = "";
  for (var j = 0; j < 50; j++){
      for (var i = 0; i < 47; i++){
        output = output.concat(PointToZone[i][j]);
        if (PointToZone[i][j] >= 10)
          output = output.concat(" ");
        else {
          output = output.concat("  ");
        }
      }
      console.log(output);
      output = "";
  }


}
function computeDist(x,y){
  return Math.sqrt( Math.pow(x - 24, 2) + Math.pow(y-3, 2));
}
function convertPointToZone(x,y){
  // check zone 0
  var dist = computeDist(x,y);
  if (dist <= 8)
    return 0;

  // check zone 1,2,3
  if (dist >=8 && dist<16){
    // zone 3
    if (x < 19){
      return 3;
    }
    // zone 1
    if (x > 30){
      return 1;
    }

    // zone 2
    else {
      return 2;
    }

  }


  // Zones 9 and 10
  if ( y >= 0 && y < 14){
    if (x >= 0 && x < 3 )
      return 10;

    if (x <50 && x >= 47)
      return 9;
  }

  // Zones 4, 5, 6, 7, 8
  if (dist >= 16 && dist<24){
    var angle = 0;

    // straight away, guarantee 6
    if (x == 25){
      return 6;
    }
    else {
      angle = Math.atan((y+0.01)/x-25);
    }


    if (angle > -34 && angle < 0){
        return 8;
    }
    if (angle < 34 && angle >0){
      return 4;
    }
    if (angle < 70 && angle >= 34){
      return 5;
    }
    if (angle > -70 && angle <= -34 ){
      return 7;
    }
    return 6;

  }

  // Zones 11, 12, 13
  if (dist > 24){
    // zone 13
    if (x < 17){
      return 13;
    }
    // zone 11
    if (x > 32){
      return 11;
    }

    // zone 12
    else {
      return 12;
    }
  }

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
  //console.log(data);
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
    //console.logs(i + ': ' + percentageMatrix[i]);
  }
}
