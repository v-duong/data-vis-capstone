function generateGlobe(json){
  clearmeshes();
  console.log("generate_globe()");
  $('.visual').empty();  

  document.body.style.backgroundImage="url('public/js/globe/loading.gif')";
  document.body.style.Position = "center center";
  document.body.style.backgroundRepeat = "no repeat";

  var container = document.getElementById('vis');
  //renderer, camera, scene,  RENDERID
  var globe = new DAT.Globe(container, renderer, camera, scene, RENDERID, effect);
  scene = globe.scene;
  

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

