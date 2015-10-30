function initbars() {
  //camera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 1, 10000 );
  camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 100000);

  camera.position.z = 800;
  camera.position.y = 600;
  camera.position.x = 600;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  controls = new THREE.OrbitControls(camera);
  //				controls.damping = 0.2;
  controls.addEventListener('change', render);

  geometry3 = new THREE.BoxGeometry(2400, 10, 2000);
  material3 = new THREE.MeshBasicMaterial({
    color: 0xa0afaf
  });

  mesh3 = new THREE.Mesh(geometry3, material3);

  scene.add(mesh3);

  mesh3.position.y = 0;

  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  $('.visual').append(renderer.domElement);
}

function animate() {

  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}


function addBar(x, y, z) {
  var frequency = 0.4;
  geometry = new THREE.BoxGeometry(49, y, 49);
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  var gcolor = new THREE.Color(Math.sin(x * frequency), Math.sin(x * frequency + 2), Math.sin(x * frequency + 4));
  material = new THREE.MeshBasicMaterial({
    color: gcolor
  });
  geometry.colorsNeedUpdate = true;
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 10 + y / 2;
  mesh.position.x = x - 500;
  mesh.position.z = z;
  scene.add(mesh);
  var edges = new THREE.EdgesHelper(mesh, 0x000000);
  edges.material.linewidth = 2;
  meshes.push(mesh);
  meshes.push(edges);

  scene.add(edges);
}

function createDictionary(_json) {
  if (typeof _json.x[0] === 'string')
    var uniqx = _.uniq(_json.x);
  if (typeof _json.y[0] === 'string')
    var uniqy = _.uniq(_json.y);
  if (typeof _json.z[0] === 'string')
    var uniqz = _.uniq(_json.z);
  var dict = [uniqx, uniqy, uniqz]
  return dict
}

function renderData(data) {
  var d;
  var dict = createDictionary(data);
  for (var i = 0; i < data.length; i++) {
    d = data[i];
    addBar(d.x * 50, d.y * 2, d.z * 50);
  }
}
