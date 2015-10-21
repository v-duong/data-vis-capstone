//function for orthographic projections
function onDocumentMouseDown_Ortho( e ) {
  e.preventDefault();
  var mouseVector = new THREE.Vector3();
  mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
  mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight );
  console.log("test");
}
