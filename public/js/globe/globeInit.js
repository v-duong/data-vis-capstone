function generateGlobe(json){
  clearmeshes();
  console.log("generate_globe()");
  $('.visual').empty();

  globeText = document.createElement('div');
  globeText.style.position = 'absolute';
  //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
  globeText.style.width = 900;
  globeText.style.height = 40;
  globeText.innerHTML = "";
  globeText.style.top = 20 + 'px';
  globeText.style.left = 70 + 'px';
  globeText.style.backgroundColor = 'rgba(255,255, 255, 0.0)'
  globeText.style.color = 'black';
  globeText.style.fontSize = '20px';
  // globeText.style.margin = "50px -400px 0px 0px";
  document.getElementById('vis').appendChild(globeText);

  var container = document.getElementById('vis');
  //renderer, camera, scene,  RENDERID
  globe = new DAT.Globe(container, renderer, camera, scene, RENDERID, effect, controls);
  scene = globe.scene;
  device_persp_controls = globe.controls;
  controls = device_persp_controls;

  // var tableSelected = $("#TableList option:selected").val();

  // var xhr = new XMLHttpRequest();

  // xhr.open( 'GET', 'static/globeData/' + tableSelected + '.json', true );
  // xhr.open( 'GET', 'static/globeData/randnum.json', true );

  // xhr.onreadystatechange = function() {
    // If we've received the data
    // if ( xhr.readyState === 4 && xhr.status === 200 ) {
      // console.log("data received");
        // Parse the JSON
        // console.log(xhr.responseText);
        console.log(json);
        // var data = JSON.parse( json );
        // // Tell the globe about your JSON data
        // globe.addData( data[2], {format: 'magnitude', name: data[0], max: data[1]} );
        globe.addData( json[0], {format: 'magnitude', name: json[2], max: json[1]} );
        // Create the geometry
        globe.createPoints();

        // Begin animation

        globe.animate();
        document.getElementById('vis').style.backgroundImage = "none";

  //   }

  // };

// Begin request
  // xhr.send( null );
}
