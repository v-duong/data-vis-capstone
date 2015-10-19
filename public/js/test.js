var camera, scene, renderer,
    geometry, material, mesh;

    init();
    animate();

    function init() {
        document.addEventListener( 'mousedown', onDocumentMouseDown_Ortho, false );
        scene = new THREE.Scene();

        //camera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 1, 10000 );
        camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 100000);

        camera.position.z = 800;
        camera.position.y = 600;
        camera.position.x = 600;
        camera.lookAt(new THREE.Vector3(0,0,0));

        geometry3 = new THREE.BoxGeometry( 2400, 10, 2000 );
        material3 = new THREE.MeshBasicMaterial( { color: 0xa0afaf} );

        mesh3 = new THREE.Mesh( geometry3, material3 );


        mesh3.castShadow = true;
        mesh3.receiveShadow = true;

        light = new THREE.DirectionalLight (0xffffff, 0.4 )
        light.position.set (0,1200,0);
        light.castShadow = true;
        light.shadowCameraNear = 1;
        light.shadowCameraFar = 100000;
        light.shadowMapWidth = 1024; // default is 512
        light.shadowMapHeight = 1024; // default is 512
        light.shadowCameraRight     =  window.innerWidth / 2;
        light.shadowCameraLeft     = window.innerWidth / - 2;
        light.shadowCameraTop      =  window.innerHeight / 2;
        light.shadowCameraBottom   = window.innerHeight / - 2;

        scene.add( mesh3 );
        scene.add( light );



        mesh3.position.y = -100

        renderer = new THREE.WebGLRenderer( { alpha: true } );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );
    }

    function animate() {

        requestAnimationFrame( animate );
        render();
    }

    function render() {
        renderer.render( scene, camera );
    }


    function addBar(x,y,z){
      geometry = new THREE.BoxGeometry( 50, y, 50 );
      material = new THREE.MeshBasicMaterial( { color: 0x101f1f} );
      mesh = new THREE.Mesh( geometry, material );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.y = 10
      mesh.position.x = x;
      mesh.position.z = z;
        scene.add( mesh );
    }
