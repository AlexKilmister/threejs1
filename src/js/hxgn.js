import * as THREE from 'three'

import {TDSLoader} from 'three/examples/jsm/loaders/TDSLoader.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from "dat.gui/src/dat";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


function init() {

	// Canvas
	const canvas = document.querySelector('canvas.webgl')
	const scene = new THREE.Scene()
	const gui = new dat.GUI()
	/**
	 * Floor
	 */
	const floor = new THREE.Mesh(
		new THREE.PlaneGeometry(10, 10),
		new THREE.MeshStandardMaterial({
			color: '#444444',
			metalness: 0,
			roughness: 0.5
		})
	)
	floor.receiveShadow = true
	floor.rotation.x = -Math.PI * 0.5
	//floor.position.y = -1.5
	//scene.add(floor)

	/**
	 * Lights
	 */
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
	scene.add(ambientLight)

	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
	directionalLight.castShadow = true
	directionalLight.shadow.mapSize.set(1024, 1024)
	directionalLight.shadow.camera.far = 15
	directionalLight.shadow.camera.left = -7
	directionalLight.shadow.camera.top = 7
	directionalLight.shadow.camera.right = 7
	directionalLight.shadow.camera.bottom = -7
	directionalLight.position.set(5, 5, 5)
	scene.add(directionalLight)

//3ds files dont store normal maps
	const normal = new THREE.TextureLoader().load( './textures/portalgun/textures/normal.jpg' );
	const loaderTDS = new TDSLoader()
	loaderTDS.load(
		'./textures/hxgn/HXGN.3ds',
		function ( object ) {
			console.log(object);
			object.scale.set(0.005, 0.005, 0.005)
			object.position.set(-2.5, -1.6, 2)
			object.rotation.set(-Math.PI * 0.5, 0, 0)
			// tds.traverse( function ( child ) {
			// 	console.log(child);
			//
			// 	if ( child.isMesh ) {
			//
			// 		child.material.specular.setScalar( 0.1 );
			// 		//child.material.normalMap = normal;
			//
			// 	}
			//
			// } );

			scene.add(object)
		})

	// loaderTDS.setResourcePath( './textures/portalgun/textures/' );
	// loaderTDS.load( './textures/portalgun/portalgun.3ds', function ( object ) {
	//
	// 	object.traverse( function ( child ) {
	// 		console.log(child);
	//
	// 		if ( child.isMesh ) {
	//
	// 			//child.material.specular.setScalar( 0.1 );
	// 			//child.material.normalMap = normal;
	//
	// 		}
	//
	// 	} );
	//
	// 	scene.add( object );
	//
	// } );

	// const dracoLoader = new DRACOLoader()
	// dracoLoader.setDecoderPath('/draco/')
	//
	// const gltfLoader = new GLTFLoader()
	// gltfLoader.setDRACOLoader(dracoLoader)
	//
	// let mixer = null
	//
	// gltfLoader.load(
	// 	'./textures/FlightHelmet/glTF/FlightHelmet.gltf',
	// 	(gltf) =>
	// 	{
	// 		gltf.scene.scale.set(1, 1, 1)
	// 		scene.add(gltf.scene)
	// 	}
	// )

	/**
	 * Sizes
	 */
	const sizes = {
		width: window.innerWidth,
		height: window.innerHeight
	}

	window.addEventListener('resize', () => {
		// Update sizes
		sizes.width = window.innerWidth
		sizes.height = window.innerHeight

		// Update camera
		camera.aspect = sizes.width / sizes.height
		camera.updateProjectionMatrix()

		// Update renderer
		renderer.setSize(sizes.width, sizes.height)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	})

	/**
	 * Camera
	 */
// Base camera
	const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
	camera.position.x = 1
	camera.position.y = 1
	camera.position.z = -2
	scene.add(camera)

// Controls
	const controls = new OrbitControls(camera, canvas)
	controls.enableDamping = true

	/**
	 * Renderer
	 */
	const renderer = new THREE.WebGLRenderer({
		canvas: canvas
	})
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


	/**
	 * Animate
	 */
	const clock = new THREE.Clock()

	const tick = () => {
		const elapsedTime = clock.getElapsedTime()


		// Update controls
		controls.update()

		// Render
		renderer.render(scene, camera)

		// Call tick again on the next frame
		window.requestAnimationFrame(tick)
	}

	tick()

}

window.addEventListener('DOMContentLoaded', () => {
	const hxgn = document.getElementById('canvas-hxgn')
	if (hxgn) {
		init()
	}
})
