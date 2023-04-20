import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {TDSLoader} from 'three/examples/jsm/loaders/TDSLoader.js'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import * as dat from "dat.gui/src/dat"

import { gsap, ScrollTrigger } from "gsap/all"
gsap.registerPlugin(ScrollTrigger)

function init() {

	// Canvas
	const canvas = document.querySelector('canvas.webgl')
	const scene = new THREE.Scene()
	const gui = new dat.GUI()
	let mouseX = 0
	let mouseY = 0
	let windowHalfX = window.innerWidth / 2
	let windowHalfY = window.innerHeight / 2
	let floatY = -1.6
	/**
	 * Ground
	 */

	function onDocumentMouseMove(event) {
		mouseX = (event.clientX - windowHalfX) / 360;
		mouseY = (event.clientY - windowHalfY) / 360;
	}

	function wrapAndRepeatTexture (map) {
		map.wrapS = map.wrapT = THREE.RepeatWrapping
		map.repeat.x = map.repeat.y = 10
	}

	// const textureLoader = new THREE.TextureLoader();
	// const placeholder = textureLoader.load("./textures/placeholder/placeholder.png");
	// const sandBaseColor = textureLoader.load("./textures/sand/Sand 002_COLOR.jpg");
	// const sandNormalMap = textureLoader.load("./textures/sand/Sand 002_NRM.jpg");
	// const sandHeightMap = textureLoader.load("./textures/sand/Sand 002_DISP.jpg");
	// const sandAmbientOcclusion = textureLoader.load("./textures/sand/Sand 002_OCC.jpg");
	//
	// const WIDTH = 80
	// const LENGTH = 80
	//
	// const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
	// const material = new THREE.MeshStandardMaterial(
	// 	{
	// 		map: sandBaseColor, normalMap: sandNormalMap,
	// 		displacementMap: sandHeightMap, displacementScale: 0.1,
	// 		aoMap: sandAmbientOcclusion
	// 	})
	// wrapAndRepeatTexture(material.map)
	// wrapAndRepeatTexture(material.normalMap)
	// wrapAndRepeatTexture(material.displacementMap)
	// wrapAndRepeatTexture(material.aoMap)
	// // const material = new THREE.MeshPhongMaterial({ map: placeholder})
	//
	// const floor = new THREE.Mesh(geometry, material)
	// floor.receiveShadow = true
	// floor.rotation.x = - Math.PI / 2
	// scene.add(floor)

	const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) )
	mesh.rotation.x = - Math.PI / 2
	mesh.receiveShadow = true
	scene.add( mesh )
	mesh.position.set(0, floatY, 0)

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
	scene.add( dirLight );

	let mixer = null

	const loaderGLTF = new GLTFLoader()
	let model = null
	loaderGLTF.load(
		'./textures/Soldier.glb',
		( glft ) => {
			model = glft.scene
			model.traverse(function (object) {
				if (object.isMesh) object.castShadow = true
			})
			scene.add(model)
			//model.scale.set(1, 1, 1)
			model.position.set(0, floatY, 0)
			//model.rotation.set(0, -Math.PI * 0.5, 0)



			mixer = new THREE.AnimationMixer(model)
			if(glft.animations.length && glft.animations[3]) {
				const action = mixer.clipAction(glft.animations[3])
				action.play()
			}
			//
			// console.log(object.animations[0]);
			//
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
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(window.devicePixelRatio);
	})

	window.addEventListener('mousemove', onDocumentMouseMove, false);

	/**
	 * Camera
	 */
// Base camera
	const camera = new THREE.PerspectiveCamera( 45, sizes.width / sizes.height, 0.1, 1000 )
	// const camera = new THREE.OrthographicCamera( sizes.width / - 2, sizes.width / 2, sizes.height / 2, sizes.height / - 2, 1, 1000 );
	scene.add( camera )
	camera.position.set( 0, 1, -3 )
	//camera.lookAt( 0, 1, 2 )

	// const cameraPosition = gui.addFolder('Camera position')
	// cameraPosition.add(camera.position, 'x').min(-30).max(30).step(0.01)
	// cameraPosition.add(camera.position, 'y').min(-30).max(30).step(0.01)
	// cameraPosition.add(camera.position, 'z').min(-30).max(30).step(0.01)
	// scene.add(camera)

	scene.background = new THREE.Color( 0xa0a0a0 )
	scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 )

	// ScrollTrigger.create({
	// 	trigger: '#target',
	// 	start: 'top bottom',
	// 	scrub: true,
	// 	//markers: true,
	// 	invalidateOnRefresh: true,
	// 	onUpdate: () => {
	//
	// 	}
	// })

	ScrollTrigger.defaults({
		immediateRender: false,
		ease: "power1.inOut"
	});
	// ScrollTrigger.defaults({});
	let anim_tl = gsap.timeline({
		scrollTrigger: {
			trigger: '#target',
			start: "top top",
			end: "bottom bottom",
			markers: true,
			scrub: true
		}
	})

	anim_tl
		//.to(scene.rotation, { y: 4.79 })
		//.to(scene.rotation, { y: 10 })
		.to(camera.position, { y: 5})
	//.to(model.position,{y: 0})

// Controls
// 	const controls = new OrbitControls(camera, canvas)
// 	controls.enableDamping = true

	/**
	 * Renderer
	 */
	const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas })
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.outputEncoding = THREE.sRGBEncoding
	renderer.shadowMap.enabled = true
	/**
	 * Animate
	 */
	const clock = new THREE.Clock()

	let previousTime = 0

	const tick = () => {
		const elapsedTime = clock.getElapsedTime()
		const deltaTime = elapsedTime - previousTime
		previousTime = elapsedTime

		if(mixer !== null) {
			mixer.update(deltaTime)
		}

		// Update controls
		//controls.update()
		if(model) {
			//model.position.y = floatY
			anim_tl
				//.to(scene.rotation, { y: 4.79 })
				// .to(scene.position, { y: 2 })
				//.to(camera.position, { y: 10 })
				// .to(camera.fov, { y: 45 })
				//.to(model.position,{y: 0})

		}


		// Render
		camera.position.x += (mouseX - camera.position.x) * .05
		//camera.position.y += (-mouseY - camera.position.y) * .05
		camera.lookAt(scene.position)
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
