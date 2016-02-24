/**
 * dat.globe Javascript WebGL Globe Toolkit
 * https://github.com/dataarts/webgl-globe
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

var DAT = DAT || {};

var timer = 0;


function generateGlobe(json){
  clearmeshes();
  console.log("generate_globe()");
  $('.visual').empty();  

  globeText = document.createElement('div');
  globeText.style.position = 'absolute';
  //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
  globeText.style.width = 900;
  globeText.style.height = 40;
  globeText.innerHTML = "";
  globeText.style.top = 20 + 'px';
  globeText.style.left = 70 + 'px';
  globeText.style.backgroundColor = 'rgba(255,255, 255, 0.0)'
  globeText.style.color = '#800080';
  globeText.style.fontSize = '20px';
  // globeText.style.margin = "50px -400px 0px 0px";
  document.getElementById('vis').appendChild(globeText);

  var container = document.getElementById('vis');
  //renderer, camera, scene,  RENDERID
  globe = new DAT.Globe(container);
  scene = globe.scene;

    // If we've received the data

        console.log(json);
        // // Tell the globe about your JSON data
        globe.addData( json[0], {format: 'magnitude', name: json[2], max: json[1]} );
        // Create the geometry
        globe.createPoints();

        // Begin animation

        globe.animate();
        document.getElementById('vis').style.backgroundImage = "none";

}

DAT.Globe = function(container) {
  var renderer;
  var camera;
  var scene;
  var animate;
  var effect;
  var opts = opts || {};
  var clickCounter = 0;
  var clickTimer = 0;
  var clickBegin = false;
  var clickTimeOut = 40;
  var velocityCounter = 0;
  var speedFactor = 0;
  var colorFn = opts.colorFn || function(x) {
    var c = new THREE.Color();
    c.setHSL( ( 0.6 - ( x * 0.5 ) ), 1.0, 0.5 );
    return c;
  };
  var imgDir = opts.imgDir || '/';

  var Shaders = {
    'earth' : {
      uniforms: {
        'texture': { type: 't', value: null }
      },
      vertexShader: [
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
          'vNormal = normalize( normalMatrix * normal );',
          'vUv = uv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D texture;',
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'vec3 diffuse = texture2D( texture, vUv ).xyz;',
          'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
          'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
          'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
        '}'
      ].join('\n')
    },
    'atmosphere' : {
      uniforms: {},
      vertexShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'vNormal = normalize( normalMatrix * normal );',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
          'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
        '}'
      ].join('\n')
    }
  };

  var w, h;
  var mesh, atmosphere, point;
  var findNthAnimation = false;
  var ROTATE_SPEED = 0.01;
  var xz_n, y_n, dxz, dy;

  var overRenderer;

  var curZoomSpeed = 0;
  var zoomSpeed = 50;

  var mouse = { x: 0, y: 0 }, mouseOnDown = { x: 0, y: 0 };
  var rotation = { x: 0, y: 0 },
      target = { x: Math.PI*3/2, y: Math.PI / 6.0 },
      targetOnDown = { x: 0, y: 0 };

  var distance = 100000, distanceTarget = 100000;
  var padding = 40;
  var PI_HALF = Math.PI / 2;
  //var device_persp_controls;
  //var orbit_persp_controls;
  var controls;
  var INITIATED = false;

  var pointList = [];
  var highlightbar;
  var max;
  var last_alpha = 0;
  var last_gamma = 0;

  function init() {

    container.style.color = '#fff';
    container.style.font = '13px/20px Arial, sans-serif';

    var shader, uniforms, material;
    w = container.offsetWidth || window.innerWidth;
    h = container.offsetHeight || window.innerHeight;

    camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000);
    camera.position.z = distance;

    scene = new THREE.Scene();
    scene.add(camera);

    var geometry = new THREE.SphereGeometry(200, 40, 30);

    shader = Shaders['earth'];
    uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms['texture'].value = THREE.ImageUtils.loadTexture("static/js/globe/world.jpg");

    material = new THREE.ShaderMaterial({

          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader

        });

    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = Math.PI;
    scene.add(mesh);
    meshes.push(mesh);

    shader = Shaders['atmosphere'];
    uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    material = new THREE.ShaderMaterial({

          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true

        });

    mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set( 1.1, 1.1, 1.1 );
    scene.add(mesh);
    meshes.push(mesh);

    geometry = new THREE.BoxGeometry(0.75, 0.75, 1);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,-0.5));

    point = new THREE.Mesh(geometry);

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(0x000000, .9)
    renderer.setSize(window.innerWidth, window.innerHeight);

    effect = new THREE.StereoEffect(renderer,30);
    effect.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    console.log("globe code run");

    container.addEventListener('mousedown', onMouseDown, false);

    container.addEventListener('mousewheel', onMouseWheel, false);

    document.addEventListener('keydown', onDocumentKeyDown, false);

    window.addEventListener('resize', onWindowResize, false);

    container.addEventListener('mouseover', function() {
      overRenderer = true;
    }, false);

    container.addEventListener('mouseout', function() {
      overRenderer = false;
    }, false);

    device_persp_controls = new THREE.DeviceOrientationControls(camera);
    device_persp_controls.enable = false;
    orbit_persp_controls = new THREE.OrbitControls(camera, renderer.domElement);
    window.addEventListener('deviceorientation', setOrientationControls, true);
    //orbit_persp_controls.addEventListener('change', animate);

    add_Click_EventListener(100);

    vrModeIsOn = false;

    INITIATED = true;

  }

  function addData(data, opts) {
    var lat, lng, size, color, i, step, colorFnWrapper;

    max = opts.max;
    console.log(max)
    console.log(typeof(max));
    console.log();
    console.log();

    opts.animated = opts.animated || false;
    this.is_animated = opts.animated;
    opts.format = opts.format || 'magnitude'; // other option is 'legend'
    if (opts.format === 'magnitude') {
      step = 3;
      colorFnWrapper = function(data, i) { return colorFn(data[i+2]); }
    } else if (opts.format === 'legend') {
      step = 4;
      colorFnWrapper = function(data, i) { return colorFn(data[i+3]); }
    } else {
      throw('error: format not supported: '+opts.format);
    }

    if (opts.animated) {
      if (this._baseGeometry === undefined) {
        this._baseGeometry = new THREE.Geometry();
        for (i = 0; i < data.length; i += step) {
          lat = data[i];
          lng = data[i + 1];
//        size = data[i + 2];
          color = colorFnWrapper(data,i);
          size = 0;
          addPoint(lat, lng, size, color, this._baseGeometry);
        }
      }
      if(this._morphTargetId === undefined) {
        this._morphTargetId = 0;
      } else {
        this._morphTargetId += 1;
      }
      opts.name = opts.name || 'morphTarget'+this._morphTargetId;
    }
    var subgeo = new THREE.Geometry();
    for (i = 0; i < data.length; i += step) {
      lat = data[i];
      lng = data[i + 1];
      color = colorFnWrapper(data,i);
      size = data[i + 2]/max;
      size = size*200;
      addPoint(lat, lng, size, color, subgeo);
    }
    if (opts.animated) {
      this._baseGeometry.morphTargets.push({'name': opts.name, vertices: subgeo.vertices});
    } else {
      this._baseGeometry = subgeo;
    }

  };

  function createPoints() {
    if (this._baseGeometry !== undefined) {
      if (this.is_animated === false) {
        this.points = new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({
              color: 0xffffff,
              vertexColors: THREE.FaceColors,
              morphTargets: false
            }));
      } else {
        if (this._baseGeometry.morphTargets.length < 8) {
          console.log('t l',this._baseGeometry.morphTargets.length);
          var padding = 8-this._baseGeometry.morphTargets.length;
          console.log('padding', padding);
          for(var i=0; i<=padding; i++) {
            console.log('padding',i);
            this._baseGeometry.morphTargets.push({'name': 'morphPadding'+i, vertices: this._baseGeometry.vertices});
          }
        }
        this.points = new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({
              color: 0xffffff,
              vertexColors: THREE.FaceColors,
              morphTargets: true
            }));
      }
      scene.add(this.points);
      meshes.push(this.points);

    }
  }

  function addPoint(lat, lng, size, color, subgeo) {

    var phi = (90 - lat) * Math.PI / 180;
    var theta = (180 - lng) * Math.PI / 180;

    point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
    point.position.y = 200 * Math.cos(phi);
    point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

    point.lookAt(mesh.position);

    point.scale.z = Math.max( size, 0.1 ); // avoid non-invertible matrix
    point.updateMatrix();

    for (var i = 0; i < point.geometry.faces.length; i++) {

      point.geometry.faces[i].color = color;

    }
    if(point.matrixAutoUpdate){
      point.updateMatrix();
    }
    subgeo.merge(point.geometry, point.matrix);
  }

  function highlightPoint(lat, lng, mag) {
    if(highlightbar != undefined) scene.remove(highlightbar)
    var size = mag * 200/max;
    var dest = getDestXYZ(lat, lng);

    var geo = new THREE.BoxGeometry(7, 7, 1);
    var material = new THREE.MeshBasicMaterial( {color: 0x800080} );
    geo.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,-0.5));

    var hpoint = new THREE.Mesh(geo, material);

    // var geometry = new THREE.SphereGeometry();
    // var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    // var sphere = new THREE.Mesh( geometry, material );

    hpoint.position.x = dest[0];
    hpoint.position.y = dest[1];
    hpoint.position.z = dest[2];

    hpoint.lookAt(mesh.position);

    hpoint.scale.z = Math.max( size, 0.1 ); // avoid non-invertible matrix
    hpoint.updateMatrix();

    // for (var i = 0; i < point.geometry.faces.length; i++) {

    //   hpoint.geometry.faces[i].color = 0xFFA500;

    // }
    if(hpoint.matrixAutoUpdate){
      hpoint.updateMatrix();
    }

    scene.add(hpoint);
    meshes.push(hpoint)
    highlightbar = hpoint;
  }

  function onMouseDown(event) {
    if (vrModeIsOn === true && isMobile === true) {
      //console.log("return");
      return;
    }
    //event.preventDefault();

    console.log("mouse down event detected");

    container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('mouseup', onMouseUp, false);
    container.addEventListener('mouseout', onMouseOut, false);

    mouseOnDown.x = - event.clientX;
    mouseOnDown.y = event.clientY;

    targetOnDown.x = target.x;
    targetOnDown.y = target.y;

    container.style.cursor = 'move';

    console.log("runs here?");
  }

  function onMouseMove(event) {
    mouse.x = - event.clientX;
    mouse.y = event.clientY;

    var zoomDamp = distance/1000;

    target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
    target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

    target.y = target.y > PI_HALF ? PI_HALF : target.y;
    target.y = target.y < - PI_HALF ? - PI_HALF : target.y;
  }

  function onMouseUp(event) {
    //console.log("mouse up event detected");
    container.removeEventListener('mousemove', onMouseMove, false);
    container.removeEventListener('mouseup', onMouseUp, false);
    container.removeEventListener('mouseout', onMouseOut, false);
    container.style.cursor = 'auto';
  }

  function onMouseOut(event) {
    //console.log("mouse out event detected");
    container.removeEventListener('mousemove', onMouseMove, false);
    container.removeEventListener('mouseup', onMouseUp, false);
    container.removeEventListener('mouseout', onMouseOut, false);
  }

  function onMouseWheel(event) {
    //console.log("mouse wheel event detected");
    //event.preventDefault();
    if (vrModeIsOn === true && isMobile === true) return;
    if (overRenderer) {
      zoom(event.wheelDeltaY * 0.3);
    }
    return false;
  }

  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 38:
        zoom(100);
        event.preventDefault();
        break;
      case 40:
        zoom(-100);
        event.preventDefault();
        break;
    }
  }

  function setOrientationControls(e) {
    if (!e.alpha) return;
    if (device_persp_controls === undefined || vrModeIsOn === false ||  isMobile === false) {
      return;
    }

    // timer += 1;
    // timer = timer % 100;
    // if (timer == 0){
    //   console.log("alpha: " + e.alpha);
    //   console.log("beta: " + e.beta);
    //   console.log("gamma: " + e.gamma);
    //   console.log(" ");
    // }


    // var device_rotation =  (e.gamma < 0)? 180 - e.alpha : e.alpha ;
    // if(e.alpha>355 || e.alpha < 5) return;
    var gamma_value  = (e.gamma>0) ? 90 - e.gamma : -90 - e.gamma;
    var device_rotation_x = e.alpha - last_alpha;
    var device_rotation_y = gamma_value - last_gamma;
    last_alpha = e.alpha;
    last_gamma = gamma_value;
    if(device_rotation_x > 50 || device_rotation_x < -50) return;
    if(device_rotation_y > 50 || device_rotation_y < -50) return;

    //console.log(device_rotation);
    //device_rotation = (device_rotation > 180) ? device_rotation - 360 : device_rotation;
    target.x += device_rotation_x/180 * Math.PI;
    target.y += device_rotation_y/180 * Math.PI;
    if (target.y > Math.PI/2 - 0.01)
      target.y =  Math.PI/2 - 0.01;
    else if (target.y <  - Math.PI/2 + 0.01)
      target.y = - Math.PI/2 + 0.01;
    //console.log("setOrientationControls working");
    device_persp_controls.connect();
    device_persp_controls.update();
    window.removeEventListener('deviceorientation', setOrientationControls);
  }

  function floatEqual(a, b){
    var c=b-a;
    c=(c<0)?-c:c;
    return c<0.001;
  }


  // function onWindowResize( event ) {
  //   camera.aspect = container.offsetWidth / container.offsetHeight;
  //   camera.updateProjectionMatrix();
  //   renderer.setSize( container.offsetWidth, container.offsetHeight );
  // }

  function onWindowResize( event ) {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.left = -1 * windowHalfX;
    camera.right = windowHalfX;
    camera.top = windowHalfY;
    camera.bottom = -1 * windowHalfY;

    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    effect.setSize( window.innerWidth, window.innerHeight );
  }


  function zoom(delta) {
    distanceTarget -= delta;
    distanceTarget = distanceTarget > 1000 ? 1000 : distanceTarget;
    distanceTarget = distanceTarget < 350 ? 350 : distanceTarget;
  }


  function getTotalRotateAngle(lat,lon){
    var destCoor = getDestXYZ(lat,lon);
    var deltaY = getDeltaY(destCoor);
    var deltaXZ = getDeltaXZ(destCoor);
    // console.log("cameraX: "+camera.position.x);
    // console.log("cameraY: "+camera.position.y);
    // console.log("cameraZ: "+camera.position.z);
    // console.log(deltaY);
    // console.log("getTotal caleed");
    // console.log(destLatlon);
    // console.log(deltaXZ);
    dxz = deltaXZ;
    dy = deltaY;

    target.x = rotation.x + dxz;
    target.y = rotation.y + dy;
    target.y -= 0.2;
  }

  function getDeltaXZ(destCoor){
    var r = Math.sqrt(Math.pow(destCoor[0], 2) + Math.pow(destCoor[2],2));
    var cameraR = Math.sqrt(Math.pow(camera.position.x, 2) + Math.pow(camera.position.z,2));
    var c = Math.asin(camera.position.x/cameraR);
    c = adjustAngle(camera.position.x,camera.position.z,c);
    var c_ = Math.asin(destCoor[0]/r);
    c_ = adjustAngle(destCoor[0], destCoor[2],c_);
    console.log(camera.position);
    console.log(destCoor);
    console.log(c);
    console.log(c_);
    console.log(c_-c);
    // if(destCoor[2]<0){c_ = -c_;}
    // var c = Math.sqrt(Math.pow(camera.position.x-destCoor[0],2) + Math.pow(camera.position.z-destCoor[2],2));
    // var deltaXZ = Math.acos((r*r+cameraR*cameraR-c*c)/(2*r*cameraR));
    return c_ - c;
  }

  function adjustAngle(x,z, result){
    if(x>0 && z<0){
      result = Math.PI - result;
    }
    else if(x<0 && z<0){
      result = Math.PI - result;
    }
    else if(x<0 && z>0){
      result = 2*Math.PI + result;
    }

    return result;
  }

  function getDeltaY(destCoor){
    var r = Math.sqrt(Math.pow(destCoor[0], 2) + Math.pow(destCoor[1], 2) + Math.pow(destCoor[2],2));
    var cameraR = Math.sqrt(Math.pow(camera.position.x, 2) + Math.pow(camera.position.y, 2) + Math.pow(camera.position.z,2));
    var angleY_ = Math.asin(destCoor[1]/r);
    var angleY = Math.asin(camera.position.y/cameraR);
    // console.log(angleY_);
    // console.log(angleY);
    return angleY_ - angleY;
  }

  function getDestXYZ(lat, lon){
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (180 - lon) * Math.PI / 180;

    var x = 200 * Math.sin(phi) * Math.cos(theta);
    var y = 200 * Math.cos(phi);
    var z = 200 * Math.sin(phi) * Math.sin(theta);
    console.log("***********");
    //highlightPoint(x, y, z);
    return [x, y, z];
  }

  function animate() {
    requestAnimationFrame(animate);
    //device_persp_controls.update();
    if (isMobile === true && vrModeIsOn === true){
      device_persp_controls.enable = true;
      orbit_persp_controls.enable = false;
    } else {
      device_persp_controls.enable = false;
      orbit_persp_controls.enable = true;
    }
    renderGlobe();
  }


  function renderGlobe() {
    zoom(curZoomSpeed);

    var rotation_speed_factor = (vrModeIsOn && isMobile) ? 1 : 0.1;
     
    rotation.x += (target.x - rotation.x) * rotation_speed_factor;
    rotation.y += (target.y - rotation.y) * rotation_speed_factor;

    distance += (distanceTarget - distance) * 0.3;
    // cameraWalk();

    camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
    camera.position.y = distance * Math.sin(rotation.y);
    camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

    camera.lookAt(mesh.position);

    //console.log("renderering");

    click_Timer();

    if (vrModeIsOn) {
      effect.render(scene, camera);
    } else {
      renderer.render(scene, camera);
    }


  }

function add_Click_EventListener(speed){
  clickCounter = 0
  clickTimer = 0
  clickBegin = false
  clickTimeOut = 40
  velocityCounter = 0
  speedFactor = speed;
  document.getElementById('vis').addEventListener("click", onclick);

}

function onclick( event ){
  //event.preventdefault();
  if (!(vrModeIsOn && isMobile)) return;
  if (velocityCounter >0){
    velocityCounter = 0;
    return;
  }
  clickBegin = true;
  clickCounter ++;
  // if (clickCounter == 2)
  //   window.removeEventListener("click", onclick);
}

function do_click_mission(){
  if (clickCounter == 1){
    console.log("1 click");
    do_single_click();
  }
  else if (clickCounter == 2){
    console.log("2 clicks");
    do_double_click();
  }
  else {
    console.log(clickCounter + " clicks");
    do_multi_click();
  }
}

function click_Timer(){
  
  if (clickBegin)
    clickTimer = (clickTimer >= clickTimeOut)?clickTimeOut : clickTimer+1;

  if (clickTimer>=clickTimeOut && clickBegin == true){
    
    do_click_mission();
    clickBegin = false;
    clickCounter = 0;
    clickTimer = 0;
    //window.addEventListener("click", onclick);
  }

  //camera.translateZ( -velocityCounter * speedFactor );
  distanceTarget  -= velocityCounter * speedFactor * 0.01;

}

//while moving, single click to stop
//while stopped, 

function do_single_click(){
  if (velocityCounter != 0)
    velocityCounter  = 0;
  else
    velocityCounter = 1;

  //camera.translateZ( -velocityCounter * speedFactor );

}

function do_double_click(){
  if (velocityCounter != 0)
    velocityCounter  = 0;
  else {
    velocityCounter = -1;
  }

  //camera.translateZ( velocityCounter * speedFactor );

}

function do_multi_click(){
  if (velocityCounter != 0)
    velocityCounter  = 0;
  else{
    if (graphType == 'scatter')
      camera.position.set(10, 10, 10);
    else if (graphType == 'bar')
      camera.position.set(600, 600, 800);
    else if (graphType == 'globe')
      camera.position.set(0, 0, 400);
    else {
      ;
    }
    camera.lookAt(new THREE.Vector3(0,0,0));
  }
}

  init();
  this.animate = animate;


  this.__defineGetter__('time', function() {
    return this._time || 0;
  });

  this.__defineSetter__('time', function(t) {
    var validMorphs = [];
    var morphDict = this.points.morphTargetDictionary;
    for(var k in morphDict) {
      if(k.indexOf('morphPadding') < 0) {
        validMorphs.push(morphDict[k]);
      }
    }
    validMorphs.sort();
    var l = validMorphs.length-1;
    var scaledt = t*l+1;
    var index = Math.floor(scaledt);
    for (i=0;i<validMorphs.length;i++) {
      this.points.morphTargetInfluences[validMorphs[i]] = 0;
    }
    var lastIndex = index - 1;
    var leftover = scaledt - index;
    if (lastIndex >= 0) {
      this.points.morphTargetInfluences[lastIndex] = 1 - leftover;
    }
    this.points.morphTargetInfluences[index] = leftover;
    this._time = t;
  });

  this.addData = addData;
  this.createPoints = createPoints;
  this.renderer = renderer;
  this.scene = scene;
  this.getTotalRotateAngle=getTotalRotateAngle;
  this.highlightPoint = highlightPoint;

  return this;

};



