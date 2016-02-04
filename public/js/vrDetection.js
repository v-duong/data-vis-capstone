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
    	controls.enabled = false;
    	if (graphType === 'bar'){
			camera = orbit_ortho_camera;
  			controls = orbit_ortho_controls;
			camera.position.set(600, 600, 800);
  			camera.lookAt(new THREE.Vector3(0,0,0));
		}
		else {
			camera = orbit_persp_camera;
			controls = orbit_persp_controls;
  			camera.lookAt(new THREE.Vector3(0,0,0));
		}
		controls.enabled = true;
    }

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
	controls.enabled = false;

	if (graphType == 'bar'){

  		if (isMobile){
  			camera = device_persp_camera;
  			controls = device_persp_controls;

  		}
  		else {
  			camera = orbit_persp_camera;
  			controls = orbit_persp_controls;
  		}

  		camera.position.set(600, 600, 800);
  		camera.lookAt(new THREE.Vector3(0,0,0));

	} 
	else if (graphType == 'scatter' ){
	 	if (isMobile){
  			camera = device_persp_camera;
  			controls = device_persp_controls;
  		}
  		else {
  			camera = orbit_persp_camera;
  			controls = orbit_persp_controls;
  		}
	}
	else if (graphType == 'basketball'){
		if (isMobile){
  			camera = device_persp_camera;
  			controls = device_persp_controls;
  		}
  		else {
  			camera = orbit_persp_camera;
  			controls = orbit_persp_controls;
  		}
  		camera.position.set(600, 640, 800);
		//camera.position.y += 40;
	}

	controls.enabled = true;

}
