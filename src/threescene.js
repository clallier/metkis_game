import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Scene, WebGLRenderer, PerspectiveCamera, HemisphereLight, SpotLight } from 'three';
import { WEBGL } from 'three/examples/jsm/WebGL.js';

export default class ThreeScene {
    constructor() {
        if (WEBGL.isWebGL2Available() === false) {
            document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
        }

        this.canvas = document.querySelector('#canvas');
        const context = this.canvas.getContext('webgl2', { alpha: true });
        this.renderer = new WebGLRenderer({ canvas: this.canvas, context });
        this.renderer.shadowMap.enabled = true;

        this.camera = new PerspectiveCamera(75, 2, 0.1, 1000);
        this.camera.position.y = 8;
        this.camera.position.z = -8;

        this.control = new OrbitControls(this.camera, this.canvas);
        this.control.enabled = false;
        this.scene = new Scene();

        this.lights = [];
        const light = new SpotLight(0xffffff, 1);
        // const light = new HemisphereLight(0xffffff, 0xffffff, 0.6);
        // light.color.setHSL(0.8, 1, 1);
        // light.groundColor.setHSL(1, 1, 0.8);
        light.position.set(0, 50, 0);
        light.castShadow = true;

        this.lights.push(light);
        this.scene.add(this.lights[0]);
    }

    render(delta) {
        this.control.update();

        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        // https://stackoverflow.com/questions/20290402/three-js-resizing-canvas
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (canvas.width !== width || canvas.height !== height) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height, false);
        }
    }
} 