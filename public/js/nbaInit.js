var camera, scene, renderer, effect;
var targetlist, mousetargetlist;
var INTERSECTED;
var mouseSphere = []
var sphereToggle = false;
var INITIAL = false




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
  genCourt();
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
    if (vrModeIsOn) {
      effect.render(scene, camera);
    } else {
     
      renderer.render(scene, camera);
    }
}

function generateYears(){
  var curYear = new Date().getFullYear();

  var yearsSinceBeginning = curYear - 1947;
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
  var zonesMiss = new Array(14);
  var zonesMade = new Array(14);
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

  generateZoneColor(zonesMade, zonesMiss);
  genPercentageText(zonesMade, zonesMiss);
}
