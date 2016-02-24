function initbars() {

  // hideCamera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 1, 10000);
  // camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 100000);
  orbit_ortho_camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 100000);
  orbit_persp_camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 1, 10000);
  device_persp_camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 1, 10000);
  
  camera = orbit_ortho_camera

  renderer.setSize(window.innerWidth, window.innerHeight);

  //add effect
  effect = new THREE.StereoEffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  // controls = new THREE.OrbitControls(camera, renderer.domElement);
  // //        controls.damping = 0.2;
  // if (isMobile = true)
  //   hidecontrols = new THREE.DeviceOrientationControls(hideCamera);
  // else
  //   hidecontrols = new THREE.OrbitControls(hideCamera, renderer.domElement);
  //        controls.damping = 0.2;
  // if (!INITIAL) {
  //   controls.addEventListener('change', render);
  //   //hidecontrols.addEventListener('change', render);
  // }

  //201601281444
  orbit_ortho_controls = new THREE.OrbitControls( orbit_ortho_camera, renderer.domElement );
  orbit_persp_controls = new THREE.OrbitControls( orbit_persp_camera, renderer.domElement);
  device_persp_controls = new THREE.DeviceOrientationControls(device_persp_camera);
  
  controls = orbit_ortho_controls

  if (!INITIAL) {
     orbit_ortho_controls.addEventListener('change', renderBar);
     orbit_persp_controls.addEventListener('change', renderBar);
  }

  orbit_persp_controls.enabled = false;
  orbit_ortho_controls.enabled = false;
  device_persp_controls.enabled = false;
  controls.enabled = true;
  add_Click_EventListener(3);
  vrModeIsOn = false;

}

// function animate() {
//   RENDERID = requestAnimationFrame(animate);
//   render();
// }


function renderBars() {
  RENDERID = requestAnimationFrame(renderBars);
  if (vrModeIsOn) {
    if (isMobile) {
      effect.render(scene, device_persp_camera); 
    }
    else { 
      effect.render(scene, orbit_persp_camera);
    }
  } 
  else {
    renderer.render(scene, orbit_ortho_camera);
  }
  click_Timer();
  controls.update();
}


function addBar(x, y, z, size, xoffset, zoffset, c, truex, truez) {
  var geometry = new THREE.BoxGeometry(size * 0.8, y, size * 0.8);
  //geometry.computeFaceNormals();
  //geometry.computeVertexNormals();
  var material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(c)
  });
  geometry.colorsNeedUpdate = true;
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 1 + y / 2;;
  mesh.position.x = x - xoffset;
  mesh.position.z = z - zoffset;
  scene.add(mesh);
  var edges = new THREE.EdgesHelper(mesh, 0x000000);
  edges.material.linewidth = 2;

  if (_.isString(truex))
    var x_ = truex;
  else{
    if ((truex % 1) === 0)
      var x_ = truex;
    else
      var x_ = truex.toFixed(2);
  }

  if (_.isString(truez))
    var z_ = truez;
  else{
    if ((truez % 1) == 0)
      var z_ = truez;
    else
      var z_ = truez.toFixed(2);
  }

  var data = [x_ , y.toFixed(2) , z_];

  mesh.data = data;

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

  if (max_y >= 0) {
    dom_max = Math.ceil(max_y / 10) * 10;
  } else {
    dom_max = Math.floor(max_y / 10) * 10;
  }
  if (min_y >= 0) {
    dom_min = 0;
    var scale = d3.scale.linear()
      .domain([dom_min, dom_max])
      .range([1, size * ticks]);
  } else {
    dom_min = Math.floor(min_y / 10) * 10;
    var scale = d3.scale.linear()
      .domain([-dom_max, dom_max])
      .range([-1 * size * ticks, size * ticks])
      .nice();
  }

  var c1 = '#0044ff';
  var c2 = '#ff3300';

  var cscale = d3.scale.linear()
              .domain([min_y, max_y])
              .range([c1, c2]);

  var xoffset = u_x.length / 2 * size;
  var zoffset = u_z.length / 2 * size;
  for (var i = 0; i < data.length; i++) {
    d = data[i];
    addBar(_.indexOf(u_x, d[keys[0]]) * size, scale(d[keys[1]]), _.indexOf(u_z, d[keys[2]]) * size, size, xoffset, zoffset, cscale(d[keys[1]]), d[keys[0]], d[keys[2]]);
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

  createGrid(min_x, max_x, min_z, max_z, dom_min, dom_max, size, ticks, u_x, u_z, xoffset, zoffset)
}

function createGrid(min_x, max_x, min_z, max_z, dom_min, dom_max, size, ticks, u_x, u_z, xoffset, zoffset) {
  if (dom_min < 0)
    var divisions = dom_max / ticks / 2
  else
    var divisions = (dom_max - dom_min) / ticks / 2
      //x-axis lines
  for (var i = 0; i < u_x.length; i++) {
    v1 = new THREE.Vector3((i + 1 / 2) * size - xoffset, 0, (-1 + 1 / 2) * size - zoffset)
    v2 = new THREE.Vector3((i + 1 / 2) * size - xoffset, 0, (u_z.length) * size - zoffset)
    line = drawLine(v1, v2)
    scene.add(line)
    meshes.push(line)
    if (u_x[i] != undefined)
      createText(i * size - xoffset, 0, (u_z.length) * size + size / 2 + u_x[i].toString().length * 10 - zoffset, u_x[i], -1 * Math.PI / 2, 0, Math.PI / 2);
  }
  //z-axis lines
  for (var i = 0; i < u_z.length; i++) {
    v1 = new THREE.Vector3(0 - xoffset - size / 2, 0, (i + 1 / 2) * size - zoffset)
    v2 = new THREE.Vector3((u_x.length) * size - xoffset, 0, (i + 1 / 2) * size - zoffset)
    line = drawLine(v1, v2)
    scene.add(line)
    meshes.push(line)
    if (u_z[i] != undefined)
      createText((u_x.length) * size - xoffset, 0, (i + 1 / 4) * size - zoffset, u_z[i], -1 * Math.PI / 2);
  }
  if (dom_min >= 0) {
    for (var i = 0; i <= ticks * 2; i++) {
      //z-lines for y
      v1 = new THREE.Vector3(0 - xoffset - size / 2, i * size / 2, -1 / 2 * size - zoffset)
      v2 = new THREE.Vector3(0 - xoffset - size / 2, i * size / 2, (u_z.length) * size - zoffset)
        //x-lines for y
      v3 = new THREE.Vector3(0 - xoffset - size / 2, i * size / 2, 0 - size / 2 - zoffset)
      v4 = new THREE.Vector3((u_x.length) * size - xoffset, i * size / 2, 0 - size / 2 - zoffset)

      if (i % 2 == 1) {
        line = drawLine(v1, v2, 0xbbbbbb)
        line2 = drawLine(v3, v4, 0xbbbbbb)
      } else {
        line = drawLine(v1, v2)
        line2 = drawLine(v3, v4)
        createText((u_x.length) * size - xoffset, i * size / 2 - size / 8, 0 - size / 2 - zoffset, divisions * i + dom_min);
      }

      scene.add(line)
      scene.add(line2)
      meshes.push(line)
      meshes.push(line2)
    }
  } else {
    for (var i = 0; i <= ticks * 2; i++) {
      //z-lines for y
      v1 = new THREE.Vector3(0 - xoffset - size / 2, i * size / 2, -1 / 2 * size - zoffset)
      v2 = new THREE.Vector3(0 - xoffset - size / 2, i * size / 2, (u_z.length) * size - zoffset)
        //x-lines for y
      v3 = new THREE.Vector3(0 - xoffset - size / 2, i * size / 2, 0 - size / 2 - zoffset)
      v4 = new THREE.Vector3((u_x.length) * size - xoffset, i * size / 2, 0 - size / 2 - zoffset)
      //neg z-lines for y
      v5 = new THREE.Vector3(0 - xoffset - size / 2, -i * size / 2, -1 / 2 * size - zoffset)
      v6 = new THREE.Vector3(0 - xoffset - size / 2, -i * size / 2, (u_z.length) * size - zoffset)
         //neg x-lines for y
      v7 = new THREE.Vector3(0 - xoffset - size / 2, -i * size / 2, 0 - size / 2 - zoffset)
      v8 = new THREE.Vector3((u_x.length) * size - xoffset, -i * size / 2, 0 - size / 2 - zoffset)

      if (i % 2 == 1) {
        line = drawLine(v1, v2, 0xbbbbbb)
        line2 = drawLine(v3, v4, 0xbbbbbb)
        line3 = drawLine(v5, v6, 0xbbbbbb)
        line4 = drawLine(v7, v8, 0xbbbbbb)
      } else {
        line = drawLine(v1, v2)
        line2 = drawLine(v3, v4)
        line3 = drawLine(v5, v6)
        line4 = drawLine(v7, v8)
        if ( i != 0)
          createText((u_x.length) * size - xoffset, -i * size / 2 - size / 8, 0 - size / 2 - zoffset, -divisions * i);
        createText((u_x.length) * size - xoffset, i * size / 2 - size / 8, 0 - size / 2 - zoffset, divisions * i);
      }

      scene.add(line)
      scene.add(line2)
      scene.add(line3)
      scene.add(line4)
      meshes.push(line)
      meshes.push(line2)
      meshes.push(line3)
      meshes.push(line4)
    }
  }
}

function setCameraPosition(num) {
  camera.position.z = num;
  camera.position.y = num;
  camera.position.x = num;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  // hideCamera.position.z = num;
  // hideCamera.position.y = num;
  // hideCamera.position.x = num;
  // hideCamera.lookAt(new THREE.Vector3(0, 0, 0));

  // ortho_camera.position.z = num;
  // ortho_camera.position.y = num;
  // ortho_camera.position.x = num;
  // ortho_camera.lookAt(new THREE.Vector3(0, 0, 0));
  // persp_camera.position.z = num;
  // persp_camera.position.y = num;
  // persp_camera.position.x = num;
  // persp_camera.lookAt(new THREE.Vector3(0, 0, 0));
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

  if (rotx) {
    text.rotation.x = rotx;
  }
  if (roty) {
    text.rotation.y = roty;
  }
  if (rotz) {
    text.rotation.z = rotz;
  }
  scene.add(text);
  meshes.push(text);
}
