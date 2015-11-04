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

var vrModeIsOn = false;

function fullScreenExitHandler(){
    if ( !(document.webkitIsFullScreen || document.mozFullScreen) ){
    	vrModeIsOn = false;
    	var temp = hideCamera;
		hideCamera = camera;
		camera = temp;
    }

}

if (document.getElementsByClassName('visual')[0].addEventListener)
{
    document.getElementsByClassName('visual')[0].addEventListener('webkitfullscreenchange', fullScreenExitHandler, false);
	document.addEventListener('mozfullscreenchange', fullScreenExitHandler, false);
}

function enterVRMode(){
	vrModeIsOn = true;
	element = document.getElementsByClassName('visual')[0];
	if ( navigator.userAgent.indexOf('Chrome') != -1 ){			//Chrome
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}
	else if (navigator.userAgent.indexOf('Firefox') != -1){		//Firefox
		element.mozRequestFullScreen();
	}
	var temp = hideCamera;
	hideCamera = camera;
	camera = temp;
}

