import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from "dat.gui/src/dat";

function init() {

	const textureLoader = new THREE.TextureLoader()
	const cubeTextureLoader = new THREE.CubeTextureLoader()
	const gui = new dat.GUI()

	// const colorTexture = textureLoader.load('./textures/earth/earth albedo.jpg')
	// const oceanTexture = textureLoader.load('./textures/earth/earth land ocean mask.png')
	// const bumpTexture = textureLoader.load('./textures/earth/earth bump.jpg')
	// const cloudsTexture = textureLoader.load('./textures/earth/clouds earth.png')
	// const lightTexture = textureLoader.load('./textures/earth/earth night_lights_modified.png')
	//
	// const matcapsTexture = textureLoader.load('./textures/matcaps/3.png')
	// const gradientTexture = textureLoader.load('./textures/gradients/5.jpg')
	//
	// const environmentMapTexture = cubeTextureLoader.load([
	// 	'./textures/environmentMaps/1/px.jpg',
	// 	'./textures/environmentMaps/1/nx.jpg',
	// 	'./textures/environmentMaps/1/py.jpg',
	// 	'./textures/environmentMaps/1/ny.jpg',
	// 	'./textures/environmentMaps/1/pz.jpg',
	// 	'./textures/environmentMaps/1/nz.jpg',
	// ])

	/**
	 * Base
	 */
// Canvas
	const canvas = document.querySelector('canvas.webgl')

	// const material = new THREE.MeshBasicMaterial()
	// material.map = doorColorTexture
	// material.color = new THREE.Color('red')
	// material.wireframe = true
	//material.opacity = 0.5
	// material.transparent = true
	// material.alphaMap = doorAlfaTexture
	// material.side = THREE.DoubleSide

	// const material = new THREE.MeshNormalMaterial()
	// material.flatShading = true

	// const material = new THREE.MeshMatcapMaterial()
	// material.matcap = matcapsTexture

	//const material = new THREE.MeshDepthMaterial()
	//const material = new THREE.MeshLambertMaterial()
	// const material = new THREE.MeshPhongMaterial()
	// material.shininess = 10
	// material.specular = new THREE.Color(0x00ff00)

	// const material = new THREE.MeshToonMaterial()
	// material.gradientMap = gradientTexture

	//const material = new THREE.MeshStandardMaterial()
	// material.metalness = 0
	// material.roughness = 1
	//material.aoMap = cloudsTexture
	//material.aoMapIntensity = 1
	// material.displacementMap = doorHeightTexture
	// material.displacementScale = 0.05
	// material.metalnessMap = doorMetalnessTexture
	// material.roughnessMap = doorRoughnessTexture
	// material.normalMap = doorNormalTexture
	// material.normalScale.set(0.5, 0.5)
	//material.transparent = true
	//material.alphaMap = cloudsTexture
	//material.map = colorTexture
	// const material = new THREE.MeshStandardMaterial()
	// material.metalness = 0.7
	// material.roughness = 0.2
	// material.envMap = environmentMapTexture

	// gui.add(material, 'metalness').min(0).max(1).step(0.0001)
	// gui.add(material, 'roughness').min(0).max(1).step(0.0001)
	// gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
	// gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)

	// const sphere = new THREE.Mesh(
	// 	new THREE.SphereBufferGeometry(1, 64, 64),
	// 	material
	// )

	// sphere.geometry.setAttribute(
	// 	'uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
	// )

	// const plane = new THREE.Mesh(
	// 	new THREE.PlaneBufferGeometry(1, 1, 100, 100),
	// 	material
	// )
	//
	// plane.geometry.setAttribute(
	// 	'uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
	// )
	//
	// const torus = new THREE.Mesh(
	// 	new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32),
	// 	material
	// )

	// torus.geometry.setAttribute(
	// 	'uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
	// )
	//
	// torus.position.x = 1.5

// Scene
	const scene = new THREE.Scene()

	//scene.add(sphere)

	const earthGeometry = new THREE.SphereGeometry(0.6, 32, 32);

	const earthmap1k = textureLoader.load('./textures/earth/earth albedo.jpg')
	const earthbump = textureLoader.load('./textures/earth/earth bump.jpg')
	const earthCloud = textureLoader.load('./textures/earth2/earthCloud.png')
	const nightLight = textureLoader.load('./textures/earth/earth night_lights_modified.png')
	const specularmap = textureLoader.load('./textures/earth2/specularmap.jpg')
	const galaxy = textureLoader.load('./textures/earth2/galaxy.png')

// earth material
	const earthMaterial = new THREE.MeshPhongMaterial({
		// roughness: 1,
		// metalness: 0,
		map: earthmap1k,
		bumpMap: earthbump,
		specularMap: specularmap,
		//normalMap: nightLight,
		bumpScale: 0.3
	});

// earth mesh
	const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
	scene.add(earthMesh);

// cloud Geometry
	const cloudGeometry = new THREE.SphereGeometry(0.62, 32, 32);

// cloud metarial
	const cloudMetarial = new THREE.MeshPhongMaterial({
		map: earthCloud,
		transparent: true,
	});

	// cloud mesh
	const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMetarial);
	scene.add(cloudMesh);


// galaxy geometry
	const starGeometry = new THREE.SphereGeometry(80, 64, 64);

// galaxy material
	const starMaterial = new THREE.MeshBasicMaterial({
		map: galaxy,
		side: THREE.BackSide
	});

// galaxy mesh
	const starMesh = new THREE.Mesh(starGeometry, starMaterial);
	scene.add(starMesh);

// ambient light
// 	const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
// 	scene.add(ambientlight);
//
// // point light
// 	const pointLight = new THREE.PointLight(0xffffff, 1)
// 	pointLight.position.set(5, 3, 5);
// 	scene.add(pointLight);
	const loader = new GLTFLoader()

	loader.load('./textures/test.gltf', function (gltf) {
		console.log(gltf, 'gltf');
		scene.add(gltf.scene);
	}, undefined, function (error) {
		console.error(error);
	});


	const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
	scene.add(ambientLight)

	const pointLight = new THREE.PointLight(0xffffff, 1)
	pointLight.position.x = 5
	pointLight.position.y = 3
	pointLight.position.z = 1
	scene.add(pointLight)
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
	const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
	camera.position.x = 1
	camera.position.y = 1
	camera.position.z = 1
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
		//starMesh.rotation.y -= 0.002;
		earthMesh.rotation.y = 0.05 * elapsedTime;
		cloudMesh.rotation.y = 0.03 * elapsedTime;

		// sphere.rotation.y = 0.1 * elapsedTime
		// plane.rotation.y = 0.1 * elapsedTime
		// torus.rotation.y = 0.1 * elapsedTime
		//
		// sphere.rotation.x = 0.15 * elapsedTime
		// plane.rotation.x = 0.15 * elapsedTime
		// torus.rotation.x = 0.15 * elapsedTime

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
	const cn = document.querySelector('#canvas-earth')
	if (cn) {
		init()
	}
})
