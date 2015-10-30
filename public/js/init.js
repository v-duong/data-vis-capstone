var camera, scene, renderer

var meshes = []

function init() {
  scene = new THREE.Scene();
}

function clearmeshes() {
  for (var i = 0; i < meshes.length; i++) {
    scene.remove(meshes[i]);
  }
  meshes = [];
}
