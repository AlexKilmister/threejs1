import * as THREE from 'three'

import { TrackballControls } from 'three/addons/controls/TrackballControls.js'
import { TDSLoader } from 'three/addons/loaders/TDSLoader.js'

let container, controls, cn
let camera, scene, renderer


function init() {

	cn = document.getElementById('canvas-hxgn')
	container = document.getElementById('container')

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 10 );
	camera.position.z = 2;

	scene = new THREE.Scene();
	scene.add( new THREE.HemisphereLight() );

	const directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 2 );
	scene.add( directionalLight );

	//3ds files dont store normal maps
	//const normal = new THREE.TextureLoader().load( 'models/3ds/portalgun/textures/normal.jpg' );

	const loader = new TDSLoader()
	loader.setResourcePath( 'assets/img/hxgn/' )
	loader.load( 'HXGN.3ds', function ( object ) {

		object.traverse( function ( child ) {

			if ( child.isMesh ) {

				child.material.specular.setScalar( 0.1 );
				//child.material.normalMap = normal;

			}

		} );

		scene.add( object );

	} );

	renderer = new THREE.WebGLRenderer({canvas: cn});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.outputEncoding = THREE.sRGBEncoding;
	document.body.querySelector('#app').appendChild(container)
	container.appendChild( renderer.domElement );

	controls = new TrackballControls( camera, renderer.domElement );

	window.addEventListener( 'resize', resize );

}

function resize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	controls.update();
	renderer.render( scene, camera );

	requestAnimationFrame( animate );

}

window.addEventListener('DOMContentLoaded', () => {
	const hxgn = document.getElementById('canvas-hxgn')
	if(hxgn) {
		init()
		animate()
	}
})
