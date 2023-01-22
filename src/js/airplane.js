import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader.js"


let scene, camera, renderer, cn, container, controls

function init() {
	cn = document.getElementById('canvas-airplane')
	container = document.getElementById('container')
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0xdddddd)

	camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,5000)
	camera.rotation.y = 45/180*Math.PI
	camera.position.x = 800
	camera.position.y = 100
	camera.position.z = 1000

	const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 )
	scene.add( ambientLight )

	const pointLight = new THREE.PointLight( 0xffffff, 0.8 )
	camera.add( pointLight )
	scene.add( camera )

	renderer = new THREE.WebGLRenderer({antialias:true, canvas: cn})
	renderer.setSize(window.innerWidth,window.innerHeight)

	document.body.querySelector('#app').appendChild(container)
	container.appendChild(renderer.domElement)

	controls = new OrbitControls(camera, renderer.domElement)
	controls.addEventListener('change', renderer)

	new MTLLoader()
		.setPath( 'assets/img/airplane/' )
		.load( '11803_Airplane_v1_l1.mtl', function ( materials ) {

			materials.preload()

			new OBJLoader()
				.setMaterials( materials )
				.setPath( 'assets/img/airplane/' )
				.load( '11803_Airplane_v1_l1.obj', function ( object ) {

					object.position.y = - 95
					scene.add( object )
					animate()
				})

		})
}

function animate() {
	renderer.render(scene,camera)
	requestAnimationFrame(animate)
}

window.addEventListener('DOMContentLoaded', () => {
	const air = document.getElementById('canvas-airplane')
	if(air) {
		init()
	}
})
