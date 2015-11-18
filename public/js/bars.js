function initbars() {

  hideCamera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 1, 10000);
  camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 100000);


  renderer.setSize(window.innerWidth, window.innerHeight);

  //add effect
  effect = new THREE.StereoEffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  //        controls.damping = 0.2;
  hidecontrols = new THREE.OrbitControls(hideCamera, renderer.domElement);
  //        controls.damping = 0.2;
  if (!INITIAL) {
    controls.addEventListener('change', render);
    hidecontrols.addEventListener('change', render);
  }
}

function animate() {
  RENDERID = requestAnimationFrame(animate);
  render();
}

function render() {
  if (vrModeIsOn) {
    effect.render(scene, camera);
  } else {
    renderer.render(scene, camera);
  }
}


function addBar(x, y, z, size) {
  var frequency = 0.4;
  var geometry = new THREE.BoxGeometry(size * 0.8, y, size * 0.8);
  //geometry.computeFaceNormals();
  //geometry.computeVertexNormals();
  var gcolor = new THREE.Color(Math.sin(x / size * frequency), Math.sin(x / size * frequency + 2), Math.sin(x / size * frequency + 4));
  var material = new THREE.MeshBasicMaterial({
    color: gcolor
  });
  geometry.colorsNeedUpdate = true;
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 1 + y / 2;;
  mesh.position.x = x - (window.innerWidth * 0.50) / 2;
  mesh.position.z = z;
  scene.add(mesh);
  var edges = new THREE.EdgesHelper(mesh, 0x000000);
  edges.material.linewidth = 2;
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
  var ticks = 5;
  var size = 50;

  var keys = _.keys(data[0]);
  var t_x = []
  var t_y = []
  var t_z = []

  for (var i = 0; i < data.length; i++) {
    t_x.push(data[i][keys[0]]);
    t_y.push(data[i][keys[1]]);
    t_z.push(data[i][keys[2]]);
  }

  var u_x = createDictionary(t_x)
  var u_y = createDictionary(t_y)
  var u_z = createDictionary(t_z)

  var min_y = _.min(u_y)
  var max_y = _.max(u_y)

  setCameraPosition(500);


  var dom_min, dom_max;

  if (min_y >= 0) {
    dom_min = Math.floor(min_y / 50) * 50;
  } else {
    dom_min = Math.floor(min_y / 50) * 50;
  }

  if (max_y >= 0) {
    dom_max = Math.ceil(max_y / 50) * 50;
  } else {
    dom_max = Math.floor(max_y / 50) * 50;
  }
  console.log(min_y + " - " + max_y)
  console.log(dom_min + " - " + dom_max)
  var scale = d3.scale.linear()
    .domain([dom_min, dom_max])
    .range([1, size * ticks]);
  //if ( ($("#z option:selected").val() === 'text') && ($("#x option:selected").val() === 'text'))
  for (var i = 0; i < data.length; i++) {
    d = data[i];
    addBar(_.indexOf(u_x, d[keys[0]]) * size, scale(d[keys[1]]), _.indexOf(u_z, d[keys[2]]) * size, size);
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
  var min_x = _.min(u_x)
  var max_x = _.max(u_x)
  var min_z = _.min(u_z)
  var max_z = _.max(u_z)

  createGrid(min_x, max_x, min_z, max_z, dom_min, dom_max, size, ticks, u_x, u_z)
}

function createGrid(min_x, max_x, min_z, max_z, dom_min, dom_max, size, ticks, u_x, u_z) {
  var divisions = (dom_max - dom_min) / ticks / 2
    //x-axis lines
  for (var i = 0; i < u_x.length; i++) {
    v1 = new THREE.Vector3((i + 1 / 2) * size - (window.innerWidth * 0.25), 0, (-1 + 1 / 2) * size)
    v2 = new THREE.Vector3((i + 1 / 2) * size - (window.innerWidth * 0.25), 0, (max_z + 1 - min_z) * size)
    line = drawLine(v1, v2)
    scene.add(line)
    meshes.push(line)
    if (u_x[i] != undefined)
      createText((i + 1 / 2) * size - (window.innerWidth * 0.25) - size/2, 0, (max_z + 1 - min_z) * size + size/2, u_x[i], -1 * Math.PI / 2, 0 , Math.PI / 2);
  }
  //z-axis lines
  for (var i = 0; i <= (max_z - min_z); i++) {
    v1 = new THREE.Vector3(0 - (window.innerWidth * 0.25) - size / 2, 0, (i + 1 / 2) * size)
    v2 = new THREE.Vector3((u_x.length) * size - (window.innerWidth * 0.25), 0, (i + 1 / 2) * size)
    line = drawLine(v1, v2)
    scene.add(line)
    meshes.push(line)
    if (u_z[i] != undefined)
      createText((u_x.length) * size - (window.innerWidth * 0.25), 0, (i + 1 / 2) * size, u_z[i], -1 * Math.PI / 2);
  }
  for (var i = 0; i <= ticks * 2; i++) {
    //z-lines for y
    v1 = new THREE.Vector3(0 - (window.innerWidth * 0.25) - size / 2, i * size / 2, -1 / 2 * size)
    v2 = new THREE.Vector3(0 - (window.innerWidth * 0.25) - size / 2, i * size / 2, (max_z - min_z + 1) * size)
      //x-lines for y
    v3 = new THREE.Vector3(0 - (window.innerWidth * 0.25) - size / 2, i * size / 2, 0 - size / 2)
    v4 = new THREE.Vector3((u_x.length) * size - (window.innerWidth * 0.25), i * size / 2, 0 - size / 2)

    if (i % 2 == 1) {
      line = drawLine(v1, v2, 0xbbbbbb)
      line2 = drawLine(v3, v4, 0xbbbbbb)
    } else {
      line = drawLine(v1, v2)
      line2 = drawLine(v3, v4)
      createText((u_x.length) * size - (window.innerWidth * 0.25), i * size / 2 - size / 8, 0 - size / 2, divisions * i + dom_min);
    }

    scene.add(line)
    scene.add(line2)
    meshes.push(line)
    meshes.push(line2)
  }
}

function setCameraPosition(num) {
  camera.position.z = num;
  camera.position.y = num;
  camera.position.x = num;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  hideCamera.position.z = num;
  hideCamera.position.y = num;
  hideCamera.position.x = num;
  hideCamera.lookAt(new THREE.Vector3(0, 0, 0));
}

function createText(x, y, z, string, rotx, roty, rotz) {
  rotx = rotx || false;
  roty = roty || false;
  rotz = rotz || false;
  var TextGeo = new THREE.TextGeometry(string, {
    font: 'helvetiker',
    height: 1,
    size: 15
  });
  var textMaterial = new THREE.MeshPhongMaterial({
    color: 0xdddddd
  });

  var text = new THREE.Mesh(TextGeo, textMaterial);
  text.position.set(x, y, z);

  if (rotx){
    text.rotation.x = rotx;
  }
  if (roty){
    text.rotation.y = roty;
  }
  if (rotz){
    text.rotation.z = rotz;
  }
  scene.add(text);
  meshes.push(text);
}
