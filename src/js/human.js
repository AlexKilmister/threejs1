import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {TDSLoader} from 'three/examples/jsm/loaders/TDSLoader.js'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as dat from "dat.gui/src/dat";

function init() {

	// Canvas
	const canvas = document.querySelector('canvas.webgl')
	const scene = new THREE.Scene()
	const gui = new dat.GUI()
	/**
	 * Ground
	 */
	const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );

	/**
	 * Lights
	 */
	const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	hemiLight.position.set( 0, 20, 0 );
	scene.add( hemiLight );

	const dirLight = new THREE.DirectionalLight( 0xffffff );
	dirLight.position.set( - 3, 10, - 10 );
	dirLight.castShadow = true;
	dirLight.shadow.camera.top = 2;
	dirLight.shadow.camera.bottom = - 2;
	dirLight.shadow.camera.left = - 2;
	dirLight.shadow.camera.right = 2;
	dirLight.shadow.camera.near = 0.1;
	dirLight.shadow.camera.far = 40;
	gui.add(dirLight, 'intensity').min(0).max(1).step(0.001)
	gui.add(dirLight.position, 'x').min(- 10).max(10).step(0.001)
	gui.add(dirLight.position, 'y').min(- 10).max(10).step(0.001)
	gui.add(dirLight.position, 'z').min(- 10).max(10).step(0.001)
	scene.add(dirLight);

	const directionalLightCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera)
	directionalLightCameraHelper.visible = false
	scene.add(directionalLightCameraHelper)



//3ds files dont store normal maps
// 	const loaderTDS = new TDSLoader()
// 	loaderTDS.load(
// 		'./textures/Geothermal Steam Factory_no_sparks.3ds',
// 		function ( object ) {
// 			console.log(object);
// 			// object.scale.set(0.005, 0.005, 0.005)
// 			// object.position.set(-2.5, -1.6, 2)
// 			// object.rotation.set(-Math.PI * 0.5, 0, 0)
// 			// tds.traverse( function ( child ) {
// 			// 	console.log(child);
// 			//
// 			// 	if ( child.isMesh ) {
// 			//
// 			// 		child.material.specular.setScalar( 0.1 );
// 			// 		//child.material.normalMap = normal;
// 			//
// 			// 	}
// 			//
// 			// } );
//
// 			scene.add(object)
// 		})
	let mixer = null

	const loaderFBX = new FBXLoader()
	loaderFBX.load(
		'./textures/Strut Walking (1).fbx',
		( object ) => {
			console.log(object);
			object.scale.set(0.01, 0.01, 0.01)
			object.position.set(0, -1, 0)
			object.rotation.set(0, 0, 0)
			object.traverse((child) => {
				//console.log(child);
				child.castShadow = true

			} );
			// const model = object
			// scene.add( model );
			//
			// model.traverse( function ( object ) {
			//
			// 	if ( object.isMesh ) object.castShadow = true;
			//
			// } );



			mixer = new THREE.AnimationMixer(object)
			const action = mixer.clipAction(object.animations[0])
			action.play()

			console.log(object.animations[0]);

			scene.add(object)
		})




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
	const camera = new THREE.PerspectiveCamera( 45, sizes.width / sizes.height, 1, 1000 )
	camera.position.set( 1, 2, 2 )
	camera.lookAt( 0, 1, 0 )
	const cameraPosition = gui.addFolder('Camera position')
	cameraPosition.add(camera.position, 'x').min(-10).max(10).step(1)
	cameraPosition.add(camera.position, 'y').min(-10).max(10).step(1)
	cameraPosition.add(camera.position, 'z').min(-10).max(10).step(1)
	scene.add(camera)

	scene.background = new THREE.Color( 0xa0a0a0 )
	scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 )

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

	const pmremGenerator = new THREE.PMREMGenerator( renderer )
	scene.background = new THREE.Color( 0xbfe3dd )
	scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture
	/**
	 * Animate
	 */
	const clock = new THREE.Clock()

	let previosTime = 0

	const tick = () => {
		const elapsedTime = clock.getElapsedTime()
		const deltaTime = elapsedTime - previosTime
		previosTime = elapsedTime

		if(mixer !== null) {
			mixer.update(deltaTime)
		}

		// Update controls
		controls.update()

		// Render
		renderer.render(scene, camera)

		// Call tick again on the next frame
		window.requestAnimationFrame(tick)
	}

	tick()
}

document.addEventListener('DOMContentLoaded', () => {
	const cn = document.querySelector('#canvas-human')
	if(cn) {
		init()
	}
})
