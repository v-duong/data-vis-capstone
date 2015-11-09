function initbars() {

  hideCamera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 1, 10000 );
  camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 10000);


  renderer.setSize(window.innerWidth, window.innerHeight);

  //add effect
  effect = new THREE.StereoEffect(renderer);
  effect.setSize( window.innerWidth, window.innerHeight );

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  //        controls.damping = 0.2;
  controls.addEventListener('change', render);
  hidecontrols = new THREE.OrbitControls(hideCamera, renderer.domElement);
  //        controls.damping = 0.2;
  hidecontrols.addEventListener('change', render);
}

function animate() {
  RENDERID = requestAnimationFrame(animate);
  render();
}

function render() {
  if (vrModeIsOn) {
    effect.render(scene, camera);
  }
  else {
    renderer.render(scene, camera);
  }
}


function addBar(x, y, z, size) {
  var frequency = 0.4;
  var geometry = new THREE.BoxGeometry(size * 0.8, y, size  * 0.8);
  //geometry.computeFaceNormals();
  //geometry.computeVertexNormals();
  var gcolor = new THREE.Color(Math.sin(x/size * frequency), Math.sin(x/size * frequency + 2 ), Math.sin(x/size * frequency  + 4 ));
  var material = new THREE.MeshBasicMaterial({
    color: gcolor
  });
  geometry.colorsNeedUpdate = true;
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 1 + y/2;;
  mesh.position.x = x - (window.innerWidth * 0.70)/2;
  mesh.position.z = z;
  scene.add(mesh);
  var edges = new THREE.EdgesHelper(mesh, 0x000000);
  edges.material.linewidth = 4;
  meshes.push(mesh);
  meshes.push(edges);
  targetlist.push(mesh);
  scene.add(edges);
}

function createDictionary(data) {
  var uniqarr = _.uniq(data);
  return uniqarr
}

function renderData(data) {
  var keys = _.keys(data[0]);
  var t_x = []
  var t_y = []
  var t_z = []

  for (var i = 0; i < data.length; i++){
    t_x.push(data[i][keys[0]]);
    t_y.push(data[i][keys[1]]);
    t_z.push(data[i][keys[2]]);
  }

  var u_x = createDictionary(t_x)
  var u_y = createDictionary(t_y)
  var u_z = createDictionary(t_z)
  console.log(u_x)
  console.log(u_z)

  var min_y = _.min(u_y)
  var max_y = _.max(u_y)

  var size = Math.floor((window.innerWidth*0.80) / u_x.length)
  setCameraPosition(size*10);

  var scale = d3.scale.linear()
                      .domain([min_y, max_y])
                      .range([1, size*5]);
  //if ( ($("#z option:selected").val() === 'text') && ($("#x option:selected").val() === 'text'))
    for (var i = 0; i < data.length; i++) {
      d = data[i];
      addBar(_.indexOf(u_x,d[keys[0]]) * size, scale(d[keys[1]]),  _.indexOf(u_z,d[keys[2]]) * size, size);
    }
    /*   For now we just use that top one. rest will be used when I can fix the cases.
  else if ($("#x option:selected").val() === 'text')
    for (var i = 0; i < data.length; i++) {
      d = data[i];
      addBar(_.indexOf(u_x,d[keys[0]]) * size, scale(d[keys[1]]), d[keys[2]] * size, size);
    }
  else if ($("#z option:selected").val() === 'text')
    for (var i = 0; i < data.length; i++) {
      d = data[i];
      addBar(d[keys[0]] * size, scale(d[keys[1]]), _.indexOf(u_z,d[keys[2]]) * size, size);
    }
  else
    for (var i = 0; i < data.length; i++) {
      d = data[i];
      addBar(d[keys[0]] * size, scale(d[keys[1]]), d[keys[2]] * size, size);
    }
*/

  for (var i = 0; i < u_x.length; i++) {
    v1 = new THREE.Vector3((u_x[i] * size - (window.innerWidth * 0.70)/2) + size/2, 0, -1 * size)
    v2 = new THREE.Vector3((u_x[i] * size - (window.innerWidth * 0.70)/2) + size/2, 0, 3 * size)
    line = drawLine(v1,v2)
    scene.add(line)
    meshes.push(line)
  }
  var min_x = _.min(u_x)
  var max_x = _.max(u_x)
  var min_z = _.min(u_z)
  var max_z = _.max(u_z)
  for (var i = 0; i < u_z.length; i++) {
    v1 = new THREE.Vector3((min_x * size - (window.innerWidth * 0.70)/2) - size*1, 0, u_z[i] * size + size/2)
    v2 = new THREE.Vector3((max_x * size - (window.innerWidth * 0.70)/2) + size*1, 0, u_z[i] * size + size/2)
    line = drawLine(v1,v2)
    scene.add(line)
    meshes.push(line)
  }
  for (var i = 0; i < 6; i++) {
    v1 = new THREE.Vector3((min_x * size - (window.innerWidth * 0.70)/2) - size/2, i * size, -1 * size)
    v2 = new THREE.Vector3((min_x * size - (window.innerWidth * 0.70)/2) - size/2, i * size, 3 * size)
    line = drawLine(v1,v2)
    scene.add(line)
    v2 = new THREE.Vector3((min_x * size - (window.innerWidth * 0.70)/2) - size*1, i * size, min_z * size - size/2)
    v3 = new THREE.Vector3((max_x * size - (window.innerWidth * 0.70)/2) + size*1, i * size, min_z * size - size/2)
    line2 = drawLine(v2,v3)
    scene.add(line2)
    meshes.push(line)
    meshes.push(line2)
  }
}

function setCameraPosition(num){
  camera.position.z = num;
  camera.position.y = num;
  camera.position.x = num;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  hideCamera.position.z = num;
  hideCamera.position.y = num;
  hideCamera.position.x = num;
  hideCamera.lookAt(new THREE.Vector3(0, 0, 0));
}
