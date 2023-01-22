import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"


let camera, scene, renderer, sphereCamera, cn, container

function init() {
	cn = document.getElementById('canvas-orbit')
	container = document.getElementById('container')

	scene = new THREE.Scene()
	camera = new THREE.PerspectiveCamera(
		70,
		window.innerWidth/window.innerHeight,
		1,
		5000
	)
	camera.position.set(0,400,1000)

	renderer = new THREE.WebGLRenderer({antialias:true, canvas: cn})
	renderer.setSize(window.innerWidth,window.innerHeight)

	document.body.querySelector('#app').appendChild(container)
	container.appendChild(renderer.domElement)
	let controls = new OrbitControls(camera, renderer.domElement)
	controls.enableZoom = false

	let urls = [
		"assets/img/st/posx.jpg",
		"assets/img/st/negx.jpg",
		"assets/img/st/posy.jpg",
		"assets/img/st/negy.jpg",
		"assets/img/st/posz.jpg",
		"assets/img/st/negz.jpg",
	]
	let loader = new THREE.CubeTextureLoader()
	scene.background = loader.load(urls)

	const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 500);

	sphereCamera = new THREE.CubeCamera(1,1000,cubeRenderTarget)
	sphereCamera.position.set(0,100,0)
	scene.add(sphereCamera)

	let sphereMaterial = new THREE.MeshBasicMaterial( {envMap: cubeRenderTarget.texture} )
	let sphereGeo = new THREE.SphereGeometry(400,50,50)
	let sphere = new THREE.Mesh(sphereGeo,sphereMaterial)
	sphere.position.set(0,100,0)
	scene.add(sphere)

	render()
}

function render() {
	renderer.render(scene,camera)
	sphereCamera.update(renderer,scene)
	requestAnimationFrame(render)
}

window.addEventListener('DOMContentLoaded', () => {
	const or = document.getElementById('canvas-orbit')
	if(or) {
		init()
	}
})
