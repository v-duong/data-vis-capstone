var PointToZone = [[10,10,10,8,8,8,8,8,8,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,8,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,8,3,3,3,3,3,3,3,3,3,2,2,0,0,0,0,0,0,0,2,2,2,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,8,8,3,3,3,3,3,3,3,3,2,2,2,2,0,0,0,2,2,2,2,2,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,8,8,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,9,9,9],
[10,10,10,8,8,8,8,8,8,8,8,8,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,4,9,9,9],
[13,13,13,8,8,8,8,8,8,8,7,7,7,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,5,5,5,4,4,4,4,4,4,4,11,11,11,11],
[13,13,13,13,8,8,8,8,7,7,7,7,7,7,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,5,5,5,5,5,4,4,4,4,4,11,11,11,11,11],
[13,13,13,13,8,8,8,7,7,7,7,7,7,7,7,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,5,5,5,5,5,5,5,5,4,4,4,11,11,11,11,11],
[13,13,13,13,13,8,7,7,7,7,7,7,7,7,7,7,7,3,3,2,2,2,2,2,2,2,2,2,2,2,2,1,5,5,5,5,5,5,5,5,5,5,5,4,11,11,11,11,11,11],
[13,13,13,13,13,13,7,7,7,7,7,7,7,7,7,7,7,7,7,2,2,2,2,2,2,2,2,2,2,2,5,5,5,8,5,5,5,5,5,5,5,5,5,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,7,7,7,7,7,7,7,7,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,7,7,7,7,7,7,7,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,7,7,7,7,7,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,7,7,7,7,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,5,5,5,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,7,7,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,5,5,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,6,6,6,6,6,6,6,6,6,6,6,6,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11],
[13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,11,11]];



function genZone10(){
  // geometry
  var geo = new THREE.Geometry();
  geo.vertices.push( new THREE.Vector3( 0+329, 4, 0-250 ) );
  geo.vertices.push( new THREE.Vector3( 140+329, 4, 0-250 ) );
  geo.vertices.push( new THREE.Vector3( 140+329, 4, 30-250 ) );
  geo.vertices.push( new THREE.Vector3( 0+329, 4, 30-250 ) ); // close the loop
  geo.faces.push(new THREE.Face3(0,1,2));
  geo.faces.push(new THREE.Face3(0,2,3));

  var material = new THREE.MeshBasicMaterial({
    //color: 0x0000ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });

  var mymesh = new THREE.Mesh( geo, material );
  //scene.add( mymesh);
  return mymesh;
}
function genZone9(){
  var geo = new THREE.Geometry();
  geo.vertices.push( new THREE.Vector3( 0+329, 4, 0+220 ) );
  geo.vertices.push( new THREE.Vector3( 140+329, 4, 0+220 ) );
  geo.vertices.push( new THREE.Vector3( 140+329, 4, 30+220 ) );
  geo.vertices.push( new THREE.Vector3( 0+329, 4, 30+220 ) ); // close the loop
  geo.faces.push(new THREE.Face3(0,1,2));
  geo.faces.push(new THREE.Face3(0,2,3));

  var material = new THREE.MeshBasicMaterial({
    //color: 0x0f00ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  // line
  var mymesh = new THREE.Mesh( geo, material );
  return mymesh;


}
function genZone0(){
  console.log("hhmmmm");
  var shape = new THREE.Shape();
  shape.moveTo( 87.5, 0 );
  shape.absarc( 0, 0, 87.5, 0, (240/180)* Math.PI, false );

  var extrudeSettings = {
    amount : 1,
    steps : 1
  };
  var material = new THREE.MeshBasicMaterial({
    //color: 0x00ff00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  var myMesh = new THREE.Mesh(geometry, material);

  myMesh.rotation.set(Math.PI/2, 0,Math.PI/2.75);
  myMesh.position.set(425,0,0);
  myMesh.__dirtyPosition = true;
  return myMesh;
  //scene.add(zones[0]);
}

function genZone1(){
    var geometry = new THREE.RingGeometry( 87.5, 167.5, 16, 2, 0, 80/180 * Math.PI);
    var material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
  //  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var mymesh = new THREE.Mesh(geometry, material);

    mymesh.rotation.set(Math.PI/2, 0,Math.PI/2.4);
    mymesh.position.set(425,2,0);
    mymesh.__dirtyPosition = true;

    return mymesh;

}
function genZone2(){
  var geometry = new THREE.RingGeometry( 87.5, 167.5, 16, 2, 0, 50/180 * Math.PI);

  var material = new THREE.MeshBasicMaterial({
    //color: 0xfff000,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
//  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  var mymesh = new THREE.Mesh(geometry, material);

  mymesh.rotation.set(Math.PI/2, 0,(2*Math.PI/2.33));
  mymesh.position.set(425,2,0);
  mymesh.__dirtyPosition = true;

  return mymesh;
}
function genZone3(){
  var geometry = new THREE.RingGeometry( 87.5, 167.5, 16, 2, 0, 80/180 * Math.PI);

  var material = new THREE.MeshBasicMaterial({
    //color: 0x00fff0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });

  var mymesh = new THREE.Mesh(geometry, material);

  mymesh.rotation.set(Math.PI/2, 0,(3*Math.PI/2.64));
  mymesh.position.set(425,2,0);
  mymesh.__dirtyPosition = true;

  return mymesh;

}

//87.5, 167.5, 16, 2, 0, 80/180 * Math.PI
function genZone4and8(){
  var curve = new THREE.EllipseCurve(
    0, 0,             // ax, aY
    80, 157.5,            // xRadius, yRadius
    -1/35 * Math.PI, 4.6/18 * Math.PI, // aStartAngle, aEndAngle
    false             // aClockwise
  );

  var points = curve.getSpacedPoints(20);
  var path = new THREE.Path();
  var geometry = path.createGeometry(points);
  geometry.vertices.push(new THREE.Vector3(125,150,0));
  geometry.vertices.push( new THREE.Vector3( 135, 125, 0 ) );
  geometry.vertices.push(new THREE.Vector3(135, -15, 0));
  geometry.vertices.push(new THREE.Vector3(75, -15, 0));
  geometry.faces.push(new THREE.Face3(20,21,22));
  for (var i = 0; i < 20; i++){
    geometry.faces.push(new THREE.Face3(i,i+1,22));
  }
  geometry.faces.push(new THREE.Face3(0,22,23));

  var material = new THREE.MeshBasicMaterial({
    //color: 0x0ffcc0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  //zones[4] = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x0f00ff}));
  var mymesh = new THREE.Mesh(geometry, material);
  mymesh.rotation.set(-Math.PI/2, 0,Math.PI/2);
  mymesh.position.set(455,4,-87.5);
  mymesh.__dirtyPosition = true;
  //scene.add(zones[4]);

  //zone 5
  var mymesh2 = new THREE.Mesh(geometry, material);
  mymesh2.rotation.set(Math.PI/2, 0, Math.PI/2);
  mymesh2.position.set(455,4,87.5);
  mymesh2.__dirtyPosition = true;
  //scene.add(zones[8]);
  return [mymesh, mymesh2];
}

function genZone5(){
  var geometry = new THREE.RingGeometry( 167.5, 247.5, 16, 2, 0, 40/180 * Math.PI);

  var material = new THREE.MeshBasicMaterial({
    //color: 0x0ccff0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
//  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  var mymesh = new THREE.Mesh(geometry, material);

  mymesh.rotation.set(Math.PI/2, 0,(2*Math.PI/3));
  mymesh.position.set(425,2,0);
  mymesh.__dirtyPosition = true;

  return mymesh;
}

function genZone6(){
  var geometry = new THREE.RingGeometry( 167.5, 247.5, 16, 2, 0, 40/180 * Math.PI);

  var material = new THREE.MeshBasicMaterial({
    //color: 0xdccffd,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
//  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  var mymesh = new THREE.Mesh(geometry, material);

  mymesh.rotation.set(Math.PI/2, 0,(Math.PI/1.125));
  mymesh.position.set(425,2,0);
  mymesh.__dirtyPosition = true;

  return mymesh;
}
function genZone7(){
  var geometry = new THREE.RingGeometry( 167.5, 247.5, 16, 2, 0, 40/180 * Math.PI);

  var material = new THREE.MeshBasicMaterial({
    //color: 0x0ffcc0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
//  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  var mymesh = new THREE.Mesh(geometry, material);

  mymesh.rotation.set(Math.PI/2, 0,(Math.PI/.9));
  mymesh.position.set(425,2,0);
  mymesh.__dirtyPosition = true;

  return mymesh;
}


function generateZoneColor(zoneMadeList, zoneMissList, zoneList){

  for (var i = 0; i < 14; i++){
    var shotPercent = zoneMadeList[i]/(zoneMadeList[i] + zoneMissList[i]);
    console.log("zone" + i + ": " + shotPercent);
    console.log("made: " + zoneMadeList[i] + '/' +   (zoneMadeList[i]+ zoneMissList[i]));
    console.log("");

    // i don't have the mesh created for these yet
    if ( i > 10)
      continue;

    // red
    if (shotPercent > .50){
      zoneList[i].material.color.setHex( 0xff0000 );
    }
    // yellow
    else if (shotPercent > .40){
      zoneList[i].material.color.setHex( 0xffff00 );
    }
    // green
    else if (shotPercent > .30){
      zoneList[i].material.color.setHex( 0x00cc00 );
    }
    else{
      zoneList[i].material.color.setHex( 0x00ccff );
    }


  }

}
