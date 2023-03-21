import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from "dat.gui/src/dat"

function init() {
	//console.log(typeFaceFont);

	const textureLoader = new THREE.TextureLoader()
	const matcapTexture = textureLoader.load('./textures/matcaps/5.png')
	const gui = new dat.GUI()

	const scene = new THREE.Scene()

	const axesHelper = new THREE.AxesHelper()
	scene.add(axesHelper)

	const fontLoader = new FontLoader()


	fontLoader.load(
		'../fonts/helvetiker_regular.typeface.json',
		(font) => {
			const textGeometry = new TextGeometry('Hello three.js!',
				{
					font: font,
					size: 0.5,
					height: 0.2,
					curveSegments: 12,
					bevelEnabled: true,
					bevelThickness: 0.03,
					bevelSize: 0.02,
					bevelOffset: 0,
					bevelSegments: 5
				})
			// textGeometry.computeBoundingBox()
			// textGeometry.translate(
			// 	- textGeometry.boundingBox.max.x * 0.5,
			// 	- textGeometry.boundingBox.max.y * 0.5,
			// 	- textGeometry.boundingBox.max.z * 0.5,
			//
			// )

			textGeometry.center()

			const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
			//textMaterial.wireframe = true
			const text = new THREE.Mesh(textGeometry, material)
			scene.add(text)

			console.time('donut')
			for(let i = 0; i < 100; i++) {
				const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
				const donut = new THREE.Mesh(donutGeometry, material)

				donut.position.x = (Math.random() - 0.5) * 10
				donut.position.y = (Math.random() - 0.5) * 10
				donut.position.z = (Math.random() - 0.5) * 10

				donut.rotation.x = Math.random() * Math.PI
				donut.rotation.y = Math.random() * Math.PI

				const scale = Math.random()

				donut.scale.set(scale, scale, scale)

				scene.add(donut)
			}
			console.timeEnd('donut')
		}
	)
	/**
	 * Base
	 */
// Canvas
	const canvas = document.querySelector('canvas.webgl')

	// const material = new THREE.MeshBasicMaterial()




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
	camera.position.z = 2
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
	const cn = document.querySelector('#canvas-test3')
	if(cn) {
		init()
	}
})
