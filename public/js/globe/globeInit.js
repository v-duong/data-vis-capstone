var camera, scene, renderer

function generateVisuals() {
      generateGlobe();
}

function generateGlobe(){
  $('.visual').empty();

  document.body.style.backgroundImage="url('public/js/globe/loading.gif')";
  document.body.style.backgroundPosition = "center center";
  document.body.style.backgroundRepeat = "no repeat";

  var container = document.getElementById('vis');
  var globe = new DAT.Globe(container);

  var tableSelected = $("#TableList option:selected").val();

  var xhr = new XMLHttpRequest();

  xhr.open( 'GET', 'static/globeData/' + tableSelected + '.json', true );
  xhr.onreadystatechange = function() {
    // If we've received the data
    if ( xhr.readyState === 4 && xhr.status === 200 ) {
      console.log("data received");
        // Parse the JSON
        console.log(xhr.responseText);
        var data = JSON.parse( xhr.responseText );
        // Tell the globe about your JSON data
        globe.addData( data[2], {format: 'magnitude', name: data[0], max: data[1]} );

        // Create the geometry
        globe.createPoints();

        // Begin animation
        globe.animate();
    }

  };

// Begin request
  xhr.send( null );
}

