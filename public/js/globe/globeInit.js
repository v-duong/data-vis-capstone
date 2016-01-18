var camera, scene, renderer

function generateVisuals() {
      generateGlobe();
}

function generateGlobe(){
  $('.visual').empty();

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
        var data = JSON.parse( xhr.responseText );

        // Tell the globe about your JSON data
        globe.addData( data[1], {format: 'magnitude', name: data[0]} );

        // Create the geometry
        globe.createPoints();

        // Begin animation
        globe.animate();
    }

  };

// Begin request
  xhr.send( null );
}

