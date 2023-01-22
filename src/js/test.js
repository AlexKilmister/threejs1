import * as THREE from 'three'
import {gsap} from "gsap/all"
import * as dat from "dat.gui/src/dat";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

function init() {
	const cn = document.querySelector('#canvas-test')
	const scene = new THREE.Scene()
	const gui = new dat.GUI()

	const loadingManager = new THREE.LoadingManager()

	loadingManager.onStart = () => {
		console.log('onStart')
	}

	loadingManager.onLoaded = () => {
		console.log('onLoaded')
	}

	loadingManager.onProgress = () => {
		console.log('onProgress')
	}

	loadingManager.onError = () => {
		console.log('onError')
	}

	const textureLoader = new THREE.TextureLoader(loadingManager)
	const texture = textureLoader.load('/assets/img/textures/door/color.jpg')

	const parametrs = {
		color: 0xfff000
	}

	const sizes = {
		width: window.innerWidth,
		height: window.innerHeight,
	}

	const cursor = {
		x: 0,
		y: 0,
	}

	window.addEventListener('mousemove', (event) => {
		cursor.x = event.clientX / sizes.width - 0.5
		cursor.y = - (event.clientY / sizes.height - 0.5)
	})

	//cube

	// const group = new THREE.Group()
	// group.position.y = -1
	// group.scale.y = 1.5
	// group.rotation.y = 1
	// scene.add(group)
	//
	// const cube1 = new THREE.Mesh(
	// 	new THREE.BoxGeometry(1,1,1),
	// 	new THREE.MeshBasicMaterial({color: 0xff0000})
	// )
	// group.add(cube1)
	//
	// const cube2 = new THREE.Mesh(
	// 	new THREE.BoxGeometry(1,1,1),
	// 	new THREE.MeshBasicMaterial({color: 0x00ff00})
	// )
	// cube2.position.x = -2
	// group.add(cube2)
	//
	// const cube3 = new THREE.Mesh(
	// 	new THREE.BoxGeometry(1,1,1),
	// 	new THREE.MeshBasicMaterial({color: 0x0000ff})
	// )
	// cube3.position.x = 2
	// group.add(cube3)


	//const geometry = new THREE.BoxGeometry(1,1,1, 5, 5, 5)
	const geometry = new THREE.BoxBufferGeometry(1,1,1)
	//const material = new THREE.MeshBasicMaterial({color: parametrs.color})
	const material = new THREE.MeshBasicMaterial({map: texture})
	const mesh = new THREE.Mesh(geometry, material)
	scene.add(mesh)

	gui.add(mesh.position, 'x', -3, 3, 0.01)
	gui.add(mesh.position, 'y', -3, 3, 0.01)
	gui.add(mesh.position, 'z', -3, 3, 0.01)

	gui.add(mesh, 'visible')

	gui.add(material, 'wireframe')

	gui.addColor(parametrs, 'color')
		.onChange(() => {
			material.color.set(parametrs.color)
		})

	//position
	//mesh.position.set(0.7,-0.6,1)

	//scale
	//mesh.scale.set(1.5,0.5,0.5)

	//rotation
	// mesh.rotation.reorder('YXZ')
	// mesh.rotation.x = Math.PI * 0.25
	// mesh.rotation.y = Math.PI * 0.25

	//axes helpers
	// const axesHelper = new THREE.AxesHelper()
	// scene.add(axesHelper)

	//camera
	const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
	camera.position.z = 3

	scene.add(camera)
	//camera.lookAt(mesh.position)
	const controls = new OrbitControls(camera, cn)
	controls.enableDamping = true

	//render
	const renderer = new THREE.WebGLRenderer({
		canvas: cn,
	})
	renderer.setSize(sizes.width, sizes.height)

	// gsap.to(mesh.position, {duration: 1, delay: 1, x: 2})
	// gsap.to(mesh.position, {duration: 1, delay: 2, x: 0})

	window.addEventListener('resize', () => {
		sizes.width = window.innerWidth
		sizes.height = window.innerHeight

		camera.aspect = sizes.width / sizes.height
		camera.updateProjectionMatrix()

		renderer.setSize(sizes.width, sizes.height)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	})

	window.addEventListener('dblclick', () => {
		const fullScreenElement = document.fullscreenElement || document.webkitFullscreenElement

		if(!fullScreenElement) {
			if(cn.requestFullscreen) {
				cn.requestFullscreen()
			}
			else if(cn.webkitRequestFullscreen) {
				cn.webkitRequestFullscreen()
			}
		}
		else {
			if(document.exitFullscreen) {
				document.exitFullscreen()
			}
			else if(document.webkitExitFullscreen) {
				document.webkitExitFullscreen()
			}
		}
	})

	const tick = () => {
		//mesh.rotation.y += 0.01

		// camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
		// camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
		// camera.position.y = cursor.y * 5
		// camera.lookAt(mesh.position)

		controls.update()

		renderer.render(scene, camera)
		window.requestAnimationFrame(tick)
	}

	tick()
}



document.addEventListener('DOMContentLoaded', () => {
	init()
})
