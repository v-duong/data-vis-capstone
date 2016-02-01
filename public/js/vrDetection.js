/*
This script allows the toggling of Virtual Reality Mode with the click of a button.
With VR Mode on, the stereoscopic effect will be enabled and it will go into full screen.
With VR Mode off, both will be disabled.

For this script to work correctly, you need to do the following:

	You need to have 2 renderings in your animation.
	The base renderer:

		renderer = new THREE.WebGLRenderer({ alpha: true });
	  	renderer.setSize(window.innerWidth, window.innerHeight);

	And the effect renderer:

	  //add effect
	  effect = new THREE.StereoEffect(renderer);
	  effect.setSize( window.innerWidth, window.innerHeight );

	Change your basic render() function:

		function render() {
			renderer.render(scene, camera);
		}

	Into:

		function render() {
		  if (vrModeIsOn) {
		    effect.render(scene, camera);
		  }
		  else {
		    renderer.render(scene, camera);
		  }
		}

See bars.js for reference.
*/


function VRBottonPressed(){
	if (!vrModeIsOn)
		enterVRMode();
	else
		fullScreenExitHandler();

}

function fullScreenExitHandler(){
    if ( !(document.webkitIsFullScreen || document.mozFullScreen || document.msFullScreen || document.fullScreen) ){
    	vrModeIsOn = false;
    	if (graphType === 'bar'){
	 	// 	var temp = hideCamera;
			// hideCamera = camera;
			// camera = temp;
			camera = ortho_camera
			camera.position.z = 800;
  			camera.position.y = 600;
  			camera.position.x = 600;
  			controls = orbit_ortho_controls
  			if (isMobile == true)
  				controls.addEventListener('change', render);
		}
    }
 //    if (isMobile == true && graphType === 'bar'){
 //    	// var temp = hidecontrols;
 //    	// hidecontrols = controls;
 //    	// controls = temp;
	// 	controls = new THREE.OrbitControls(hideCamera, renderer.domElement);
 //    	controls.addEventListener('change', render);
	// }

}

if (document.getElementsByClassName('visual')[0].addEventListener)
{
    document.getElementsByClassName('visual')[0].addEventListener('webkitfullscreenchange', fullScreenExitHandler, false);
	document.addEventListener('mozfullscreenchange', fullScreenExitHandler, false);
	document.addEventListener('fullscreenchange', fullScreenExitHandler, false);
	document.addEventListener('msfullscreenchange', fullScreenExitHandler, false);
}

function enterVRMode(){
	vrModeIsOn = true;
	// if (isMobile == false)
	// 	hidecontrols = new THREE.DeviceOrientationControls(hideCamera);
	var element = document.getElementsByClassName('visual')[0];
	if ( navigator.userAgent.indexOf('Chrome') != -1 ){			//Chrome
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}
	else if (navigator.userAgent.indexOf('Firefox') != -1){		//Firefox
		element.mozRequestFullScreen();
	}
	else if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
	if (graphType === 'bar'){
	 // 	var temp = hideCamera;
		// hideCamera = camera;
		//camera = temp;
		camera = persp_camera
		camera.position.z = 800;
   		camera.position.y = 600;
  		camera.position.x = 600;
  		if (isMobile == true){
  			controls.removeEventListener('change', render);
  			controls = device_controls
  		}
  		else {
  			controls = orbit_persp_controls
  		}
	}
	if (graphType === 'scatter'){
	 	camera = hideCamera;
	}
	//if (isMobile == true && graphType === 'bar'){
		// var temp = hidecontrols;
  //   	hidecontrols = controls;
  //   	controls = temp;
	//	controls = new THREE.DeviceOrientationControls(hideCamera);
    //	controls.addEventListener('change', render);
	//}



}
