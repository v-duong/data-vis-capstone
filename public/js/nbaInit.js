var camera, scene, renderer;
var targetlist, mousetargetlist;
var INTERSECTED;
var mouseSphere = []
var sphereToggle = false;
var sprite1;


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
    url: webpage,
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

  });
}

function init() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({
    alpha: true
  });

  $('.visual').append(renderer.domElement);
  sphereToggle = false;


  canvas1 = document.createElement('canvas'); //canvas for text popup
  context1 = canvas1.getContext('2d');

  texture1 = new THREE.Texture(canvas1); //texture for canvas
  texture1.needsUpdate = true;

}


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

  retreiveNBAData();
  generatePlainCourtTexture();

}

function generatePlainCourtTexture(){

  //scene = new THREE.Scene();
  init();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

	//renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

  $('.visual').append(renderer.domElement);
	var geometry = new THREE.BoxGeometry( 940, 500, 1 );
	var material = new THREE.MeshBasicMaterial( { map : THREE.ImageUtils.loadTexture("static/img/basketball_court.png")} );
	var cube = new THREE.Mesh( geometry, material );

	scene.add( cube );
	camera.position.z = 500;
	var render = function () {
		requestAnimationFrame( render );
		renderer.render(scene, camera);
	};
	render();

}
