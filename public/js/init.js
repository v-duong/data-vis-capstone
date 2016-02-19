var camera, scene, renderer
var texts
var controls
var effect
var camera
var meshes = []
var targetlist
var INTERSECTED
var INITIAL = false
var hidecontrols
var hidecamera
var graphType
var RENDERID = null
var mouseSphere = []
var sphereToggle = false
var sprite1;
var canvas1, context1, texture1
var isMobile = false
var vrModeIsOn = false
var cities_, data_;
var globeText;
var globe;


//201601281441
var orbit_ortho_controls
var orbit_persp_controls
var device_persp_controls
// var persp_camera
// var ortho_camera
var orbit_ortho_camera
var orbit_persp_camera
var device_persp_camera



function parseURLArg(){
  var visSelect = GetURLParameter('visualization');
  console.log(visSelect);
  switch(visSelect){
    case "globe" :
      $("#VisualList").val("globe");
      break;
    case "scatter" :
      $("#VisualList").val("scatter");
      break;
    case "bar":
      $("#VisualList").val("bar");
      break;
    case "basketball" :
      $("#VisualList").val("basketball");
      break;
    default:
      console.log("no URL parameters used");
      return;

  }
  visChange();


}

// AutoDetectTable
function detectTable(){
  var tableSelect = GetURLParameter('table');
  if (tableSelect == null)
    return;

  // make sure it exist in dropdown list
  $("#TableList option").each(function(){
    //console.log($(this).val());
    if (tableSelect == $(this).val()){
      $("#TableList").val(tableSelect);
      tableChange();

    }
  });
}


// auto fills NBA Team Dropdown with URL Argument
function detectNBATeam(){
  var teamSelected = GetURLParameter('teamID');
  if (teamSelected == null)
    return;
  var count = 0;
  $("#TeamName option").each(function(){
    if (teamSelected == $(this).val()){
      var teamCol = document.getElementById('TeamName');
      teamCol.selectedIndex = count;
      teamChange(teamSelected);
      return;
    }
    count++;
  });
}

// auto fills NBA Player Dropdown with URL Argument
function detectNBAPlayer(){
  var playerSelected = GetURLParameter('playerID');
  if (playerSelected == null)
    return;
  var count = 0;
  $("#PlayerName option").each(function(){
    if (playerSelected == $(this).val()){
      var playerCol = document.getElementById('PlayerName');
      playerCol.selectedIndex = count;
      return;
    }
    count++;
  });
}

// generate Columns based on URL for Basketball
function detectBasketballColsURL(){
  var tableSelected = $("#TableList option:selected").text();
  if(tableSelected == 'NBA'){
    var seasonSelected = GetURLParameter('seasonID');
    var teamSelected = GetURLParameter('teamID');
    var playerSelected = GetURLParameter('playerID');
    var count = 0;
    $("#Season option").each(function(){
      if (seasonSelected == $(this).val()){
        var seasonCol = document.getElementById('Season');
        seasonCol.selectedIndex = count;
        seasonChange(seasonSelected);
        return;
      }
      count++;
    });
  }
  else {
    var xSelect = GetURLParameter('coutX');
    var ySelect = GetURLParameter('courtY');
    var shotSelect = GetURLParameter('shot');

    var count = 0;

    if (xSelect != null) {
      $("#courtXColumn option").each(function(){
        if (xSelect == $(this).text()){
          var colElem1 = document.getElementById('courtXColumn');
          colElem1.selectedIndex = count;
        }
        count++;
      });
    }

    if (ySelect != null){
      count = 0;
      $("#courtYColumn option").each(function(){
        if (ySelect == $(this).text()){
          var colElem2 = document.getElementById('courtYColumn');
          colElem2.selectedIndex = count;
        }
        count ++;
      });
    }

    if (shotSelect){
      count = 0;
      $("#shotColumn option").each(function(){
        if (shotSelect == $(this).text()){
          var colElem3 = document.getElementById('shotColumn');
          colElem3.selectedIndex = count;
        }
        count ++;
      });
    }
  }
}

function generateURLForSharing(){

  var genURL = window.location.href;
  var n = genURL.indexOf("?");
  if (n > 0)
    genURL = genURL.substring(0, n);

  if (genURL[genURL.length -1] == '#')
    genURL = genURL.substring(0, genURL.length - 1);
  genURL = genURL.concat("?");
  var visualSelected =  $("#VisualList option:selected").val();
  if (visualSelected != null)
    genURL = genURL.concat('visualization=' + visualSelected + '&');
  var tableSelected = $("#TableList option:selected").text();
  if (tableSelected != null)
    genURL = genURL.concat('table=' + tableSelected+ '&');

  switch(visualSelected){
    case 'bar':
    case 'scatter':
      var col1 = $("#xColumn option:selected").text();
      var col2 = $("#yColumn option:selected").text();
      var col3 = $("#zColumn option:selected").text();
      if (col1 != null)
        genURL = genURL.concat('x=' + col1+ '&');
      if (col2 != null)
        genURL = genURL.concat('y=' + col2+ '&');
      if (col3 != null)
        genURL = genURL.concat('z=' + col3+ '&');
      var xFilter = $("#sliderX").slider("option", "values");
      var yFilter = $("#sliderY").slider("option", "values");
      var zFilter = $("#sliderZ").slider("option", "values");
      if (xFilter[0] != undefined)
        genURL = genURL.concat('xFrom=' + xFilter[0] + '&');
      if (xFilter[1] != undefined)
        genURL = genURL.concat('xTo=' + xFilter[1]+ '&');
      if (yFilter[0] != undefined)
        genURL = genURL.concat('yFrom=' + yFilter[0]+ '&');
      if (yFilter[1] != undefined)
        genURL = genURL.concat('yTo=' + yFilter[1]+ '&');
      if (zFilter[0] != undefined)
        genURL = genURL.concat('zFrom=' + zFilter[0]+ '&');
      if (zFilter[1] != undefined)
        genURL = genURL.concat('zTo=' + zFilter[1]+ '&');
    break;

    case 'globe':
      console.log("Globe");
      var col1 = $("#xColumn option:selected").text();
      var col2 = $("#yColumn option:selected").text();
      var col3 = $("#zColumn option:selected").text();
      if (col1 != null)
        genURL = genURL.concat('x=' + col1+ '&');
      if (col2 != null)
        genURL = genURL.concat('y=' + col2+ '&');
      if (col3 != null)
        genURL = genURL.concat('z=' + col3+ '&');
      break;
    case 'basketball':
      if (tableSelected == 'NBA'){
        var playerID = $("#PlayerName option:selected").val();
        var teamID = $("#TeamName option:selected").val();
        var seasonID = $("#Season option:selected").val();
        console.log(playerID);
        console.log(teamID);
        console.log(seasonID);
        if (playerID != null)
          genURL = genURL.concat('playerID=' + playerID + '&');
        if (teamID != null)
          genURL = genURL.concat('teamID=' + teamID+ '&');
        if (seasonID != null)
          genURL = genURL.concat('seasonID=' + seasonID+ '&');

      }
      else {
       var col1 = $("#courtXColumn option:selected").text();
       var col2 = $("#courtYColumn option:selected").text();
       var col3 = $("#shotColumn option:selected").text();
       if (col1 != null)
         genURL = genURL.concat('x=' + col1+ '&');
       if (col2 != null)
         genURL = genURL.concat('y=' + col2+ '&');
       if (col3 != null)
         genURL = genURL.concat('z=' + col3+ '&');
       console.log("basketball");

     }
     break;
      default:
        console.log("matched nothign: " + tableSelected);
        break;

  }

  // create text box for link and paste link inside
  $("#shareLink").html("");
  $("#shareLink").html('<form>Link:<br><input id="shareLinkID" type="text" name="sharelink" value = "' + genURL + '"><br></form>');
  document.getElementById('shareLinkID').focus();
  document.getElementById('shareLinkID').select();

}

// generate Columns based on URL for Globe
function detectGlobeColsURL(){
  var latSelect = GetURLParameter('lat');
  var longSelect = GetURLParameter('long');
  var magSelect = GetURLParameter('mag');

  var count = 0;

  if (latSelect != null){
    $("#xColumn option").each(function(){
      if (latSelect == $(this).text()){
        var colElem1 = document.getElementById('xColumn');
        colElem1.selectedIndex = count;
      }
      count++;
    });
  }

  if (longSelect != null){
    count = 0;
    $("#yColumn option").each(function(){
      if (longSelect == $(this).text()){
        var colElem2 = document.getElementById('yColumn');
        colElem2.selectedIndex = count;
      }
      count ++;
    });
  }
  if (magSelect != null){
    count = 0;
    $("#zColumn option").each(function(){
      if (magSelect == $(this).text()){
        var colElem3 = document.getElementById('zColumn');
        colElem3.selectedIndex = count;
      }
      count ++;
    });
  }

}

// generate columns based on URL for Gen Graphs
function detectXYZGenVis(){
  //Get Column
  var xSelect = GetURLParameter('x');
  var ySelect = GetURLParameter('y');
  var zSelect = GetURLParameter('z');
  var count = 0;
  $("#xColumn option").each(function(){
    if (xSelect == $(this).text()){
      var colElem1 = document.getElementById('xColumn');
      colElem1.selectedIndex = count;
      switch (colElem1[count].value){
        case 'double precision':
          generateNumericColumnFilter('#xColumn');
          break;
        case 'text':
          generateTextColumnFilter('#xColumn');
          break;
        default:
          break;
      }
    }
    count++;
  });
  count = 0;
  $("#yColumn option").each(function(){
    if (ySelect == $(this).text()){
      var colElem2 = document.getElementById('yColumn');
      colElem2.selectedIndex = count;
      switch (colElem2[count].value){
        case 'double precision':
          generateNumericColumnFilter('#yColumn');
          break;
        case 'text':
          generateTextColumnFilter('#yColumn');
          break;
        default:
          break;
      }
    }
    count ++;
  });
  count = 0;
  $("#zColumn option").each(function(){
    if (zSelect == $(this).text()){
      var colElem3 = document.getElementById('zColumn');
      colElem3.selectedIndex = count;
      switch (colElem3[count].value){
        case 'double precision':
          generateNumericColumnFilter('#zColumn');
          break;
        case 'text':
          generateTextColumnFilter('#zColumn');
          break;
        default:
          break;
      }
    }
    count ++;
  });

}
$(document).ready( function () {
  parseURLArg();
});

function GetURLParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam){
            return sParameterName[1];
        }
    }
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
  // device detection
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

  window.addEventListener('deviceorientation', setOrientationControls, true);
  //20160209
  // if ((window.DeviceMotionEvent) {
  //   window.addEventListener('devicemotion', deviceMotionHandler, false);
  // } else {
  //   document.getElementById("dmEvent").innerHTML = "Not supported."
  // } 

  vrModeIsOn = false;
}

$("#sphere").change(function() {
  if (this.checked)
    sphereToggle = true;
  else {
    sphereToggle = false;
  }
})

function resetVisuals(){
  $('.visual').empty();
  INITIAL = false;
}

function generateVisuals() {
  console.log("GenerateingVisuals");
  var tableSelected = $("#VisualList option:selected").val();
  switch (tableSelected) {
    case 'bar':
      resetVisuals();
      graphType = 'bar';
      generateBar();
      break;
    case 'scatter':
      resetVisuals();
      graphType = 'scatter';
      generateScatter();
      break;
    case 'basketball':
      graphType = 'basketball';
      generateBasketball();
      break;
    case 'globe':
      graphType = 'globe';
      createGlobe();
    default:
      break;
  }
}

function changeColsLable(first, second, third){

}


function generateBasketball(){
  clearmeshes();
  if (RENDERID != null)
    cancelAnimationFrame(RENDERID);
  if (!INITIAL) {
    init();
    INITIAL = true;

  }
  //camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

	renderer.setSize( window.innerWidth, window.innerHeight );

  $('.visual').append(renderer.domElement);
  genCourt();
  generateZones();
  initbasketball();

   camera.position.y = 800;
   camera.lookAt(0,0,0);


  var tableSelected = $("#TableList option:selected").val();
  if (tableSelected == 'NBA'){
    retreiveNBAData();
  }
  else {
    var x = $("#courtXColumn option:selected").text();
    var y = $("#courtYColumn option:selected").text();
    var z = $("#shotColumn option:selected").text();

    $.getJSON('/retrieveData', {
      tableName: tableSelected,
      columnList: [x,y,z]
    }, function(data) {
      calculateZones(data);
    });
  }
  //calculateZones();
	renderBasketball();
}



function calculateZones(data){

  var zonesMiss = new Array(14);
  var zonesMade = new Array(14);

  var courtX = $("#courtXColumn option:selected").text();
  var courtY = $("#courtYColumn option:selected").text();
  var shotFlag = $("#shotColumn option:selected").text();

  // set zonesMade/Miss array
  for (var i = 0; i < 14; i++){
    zonesMade[i] = 0;
    zonesMiss[i] = 0;
  }

  var keys = _.keys(data[0]);
  console.log(data[0]);
  console.log(data[1]);
  for (var i = 0; i < data.length; i++) {
    var indexX= Math.round(( data[i][keys[0]]+250 )/10);
    var indexY=Math.round(( data[i][keys[1]] + 40)/10);  // add 40 to include the distance from base line to rim
    if ((indexY >= 47) || (indexX < 0) || (indexX >= 50) )
     continue;
    // if its a make
    if (data[i][keys[2]] == 1){
      // for now we won't include shots from back court
      zonesMade[PointToZone[indexY][indexX]]++;
    }
    else {
      zonesMiss[PointToZone[indexY][indexX]]++;
    }
  }

  generateZoneColor(zonesMade, zonesMiss);
  genPercentageText(zonesMade, zonesMiss);
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

  initscatter();

  targetlist = [];
  mousetargetlist = [];
  texts = [];
  var scales = [];
  setupScene();
  var normalMaterial = new THREE.MeshNormalMaterial();
  var tableName = $("#TableList option:selected").val();
  var x = $("#xColumn option:selected").text();
  var y = $("#yColumn option:selected").text();
  var z = $("#zColumn option:selected").text();
  var FilterQuery = BarScatterFilterQuery();
  $.getJSON('/retrieveData', {
    tableName: tableName,
    columnList: [x,y,z],
    filterQuery: FilterQuery
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
  console.log("generateBar()");
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
  //animate();
  renderBars();
  console.log("After renderBars()");
  targetlist = [];
  mousetargetlist = [];
  scater_check = 0;
  var tableSelected = $("#TableList option:selected").val();
  var x = $("#xColumn option:selected").text();
  var y = $("#yColumn option:selected").text();
  var z = $("#zColumn option:selected").text();

  console.log("wtf");
  // generate bar/Scatter Query Based on Filters
  console.log(x);
  console.log(y);
  console.log(z);
  var FilterQuery = BarScatterFilterQuery();
  var test;
  $.getJSON('/retrieveData', {
    tableName: tableSelected,
    columnList: [x,y,z],
    filterQuery: FilterQuery
  }, function(data) {
    renderData(data);
  });

}

//for globe
function createGlobe(){
  var tableSelected = $("#TableList option:selected").val();
  var lat = $("#xColumn option:selected").text();
  var longi = $("#yColumn option:selected").text();
  var mag = $("#zColumn option:selected").text();
  var order = " ORDER BY "+mag+" DESC";
  document.getElementById('vis').style.background = "#ffffff url('static/js/globe/ajax-loader.gif') no-repeat center center";
  createFindNthLarge();

  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;


  $.getJSON('/retrieveData', {
    tableName: tableSelected,
    columnList: [lat,longi,mag],
    orderBy: order
    // filterQuery: FilterQuery
  }, function(data) {
      var temp, points, max, json;
      points = [];
      max = 0;
      for(var i in data)
      {
        temp = data[i];
        // console.log(temp[lat]+ " "+temp[longi]+" "+temp[mag]);
        points.push(temp[lat]);
        points.push(temp[longi]);
        points.push(temp[mag]);
        if(temp[mag]>max){max = temp[mag];}
      }
      json = [points, max, tableSelected];
      generateGlobe(json);
      data_ = data;
  });

}

function findNthLargest(){
  if(data_==null || data_==undefined){return;}
  var index = document.getElementById("nth").value;
  findMatchCity(cities_,data_,index);
}

function findMatchCity(cities, data, index){
  var lat = $("#xColumn option:selected").text();
  var longi = $("#yColumn option:selected").text();
  while(data[index-1][lat]==null || data[index-1][longi]==null){index++;}
  var destLocation = [data[index-1][lat], data[index-1][longi]]
  globe.getTotalRotateAngle(destLocation[0],destLocation[1]);
  var geocoder = new google.maps.Geocoder();
  // var tempLat, tempLong;
  // var shortestDist, tempDist;
  // var destCityName;
  console.log(destLocation);
  var latlng = {lat:destLocation[0], lng:destLocation[1]}
  var adress, i, findData, cityAddress;
  // console.log(geocoder);
  findData = false;
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      address = results[0].address_components;
      address = address.slice(2, -1);
      cityAddress = [];
      for(i = 0; i<address.length;i++){
        cityAddress.push(address[i].long_name);
      }
      cityAddress = cityAddress.join(",");
      globeText.innerHTML = cityAddress;
      console.log(cityAddress);


    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });



  // shortestDist = 999999;
  // destCityName = "";
  // for(var i in cities){
  //   tempLat = cities[i]["latitude"];
  //   tempLong = cities[i]["longitude"];
  //   tempDist = Math.sqrt( Math.pow((destLocation[0]-tempLat),2) + Math.pow((destLocation[1]-tempLong),2));
  //   if(tempDist<shortestDist){
  //     shortestDist = tempDist;
  //     destCityName = cities[i]['city'];
  //   }
  //   // console.log(tempLat+" "+tempLong);
  //   // console.log(tempDist);
  //   // console.log(shortestDist);
  //   // console.log(destCityName);
  // }
  // console.log(destCityName);

}

function clearmeshes() {
  for (var i = 0; i < meshes.length; i++) {
    scene.remove(meshes[i]);
  }
  meshes = [];
  clearBasketballMesh();
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


function setOrientationControls(e) {
  if (!e.alpha || device_persp_controls === undefined) {
    return;
  }
  device_persp_controls.connect();
  device_persp_controls.update();
  window.removeEventListener('deviceorientation', setOrientationControls);
}



//2016-01-26-05:35
//window.addEventListener('dblclick', doubleClickInVRModel, true);

//2016-01-26-05:36
// function doubleClickInVRModel(event)
// {
//   if (vrModeIsOn==true)



// }


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
