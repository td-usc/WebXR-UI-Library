import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Scene } from 'three'

import horizontalGridVertexShader from './shaders/horizontalGrid/vertex.glsl'
import horizontalGridFragmentShader from './shaders/horizontalGrid/fragment.glsl'

import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

import * as UI from './ui.js';


let controller1, controller2;
			let controllerGrip1, controllerGrip2;

// /**
//  * Base
//  */
// // Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white');

scene.add(new THREE.AxesHelper())

//light
const light = new THREE.AmbientLight( 0xFFFFFF );
scene.add(light);

var cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 'red'}))
cube.position.z -= 3;
scene.add(cube)

let isRed = true;
function onSelectStart(event){
    cube.material.color = isRed ? cube.material.color.set('blue') : cube.material.color.set('red');
    isRed = !isRed

}



//grid floorplane
const geometry = new THREE.PlaneGeometry( 100, 100 );
const horizontalGridMaterial = new THREE.ShaderMaterial({
    vertexShader: horizontalGridVertexShader,
    fragmentShader: horizontalGridFragmentShader,
    transparent: true,
});
const floorPlane = new THREE.Mesh( geometry, horizontalGridMaterial );
floorPlane.rotation.x -= Math.PI/2;
scene.add( floorPlane );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0.0;
camera.position.y = 0.0;
camera.position.z = 2.5
camera.lookAt(0,1,0);
// camera.position.x = 3
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.xr.enabled = true;
document.body.appendChild( VRButton.createButton( renderer ) );






controller1 = renderer.xr.getController( 0 );
controller1.addEventListener( 'selectstart', onSelectStart );
// controller1.addEventListener( 'selectend', onSelectEnd );
scene.add( controller1 );

controller2 = renderer.xr.getController( 1 );
controller2.addEventListener( 'selectstart', onSelectStart );
// controller2.addEventListener( 'selectend', onSelectEnd );
scene.add( controller2 );

const controllerModelFactory = new XRControllerModelFactory();

controllerGrip1 = renderer.xr.getControllerGrip( 0 );
controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
scene.add( controllerGrip1 );

controllerGrip2 = renderer.xr.getControllerGrip( 1 );
controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
scene.add( controllerGrip2 );

/**
 * UI Text Box
 */
const textBox = new UI.TextBox("This is a test of the UI system's ability to display text on a plane.");
scene.add(textBox.mesh);



/**
 * Animate
 */
const clock = new THREE.Clock();
let delta = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    // Update controls
    controls.update();
    delta += clock.getDelta();
    // material.uniforms.uTime.value = elapsedTime;
}

tick();

renderer.setAnimationLoop( function () {
    tick();
	renderer.render( scene, camera );
});