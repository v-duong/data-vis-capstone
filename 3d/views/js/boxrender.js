var camera, scene, renderer,
    geometry, material, mesh;

    init();
    animate();

    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 800;
        camera.position.y = 600;
        camera.lookAt(new THREE.Vector3(0,0,0));

        geometry = new THREE.BoxGeometry( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000} );
        geometry2 = new THREE.BoxGeometry( 400, 200, 400 );
        material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00} );
        geometry3 = new THREE.BoxGeometry( 2400, 10, 1000 );
        material3 = new THREE.MeshBasicMaterial( { color: 0xa0afaf} );


        mesh = new THREE.Mesh( geometry, material );
        mesh2 = new THREE.Mesh( geometry2, material2 );
        mesh3 = new THREE.Mesh( geometry3, material3 );

        mesh.castShadow = true;
        mesh2.castShadow = true;
        mesh3.castShadow = true;
        mesh3.receiveShadow = true;

        light = new THREE.DirectionalLight (0xffffff, 0.5 )
        light.position.set (0,1200,0);
        light.castShadow = true;
        light.shadowMapWidth = 1024; // default is 512
        light.shadowMapHeight = 1024; // default is 512


        scene.add( mesh );
        scene.add( mesh2 );
        scene.add( mesh3 );
        scene.add( light );


        mesh.position.y = 100
        mesh2.position.y = 220
        mesh2.position.x = 420
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
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        mesh2.rotation.x += 0.02;
        mesh2.rotation.z += 0.02;

        renderer.render( scene, camera );
    }
