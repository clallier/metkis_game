import MiniConsole from './miniconsole';
import ThreeScene from './threescene';
import MeshFactory from './meshfactory';
import SpriteSheet from './spritesheet'
import TouchController from './touchcontroller';
import EntityArray from './entityarray';

import constants from './game/constants.json';
import Block from './game/block';
import Tile from './game/tile';
import Item from './game/item';
import Hero from './game/hero';

import CANNON from 'cannon';
import CannonDebugRenderer from './cannondebugrenderer';

export default class App {
    constructor() {
        new MiniConsole();
        this.lastTime = 0;
        this.ts = new ThreeScene();
        this.world = new CANNON.World();
        this.world.gravity.set(0, -10, 0);

        this.debugRenderer = new CannonDebugRenderer(this.ts.scene, this.world);
        this.controller = new TouchController();

        // TODO to be replaced by an ECS
        this.entities = [];

        window.addEventListener('resize', () => this.resize(), false);
        this.resize()

        const axes = MeshFactory.createAxes();
        axes.position.y = 1;
        this.ts.scene.add(axes);

        const text = MeshFactory.createText("READY TO 🍪?!");
        text.position.y = 2;
        this.ts.scene.add(text);
    }

    async start() {
        const spriteSheet = new SpriteSheet('resources/textures/raw_tileset01.png', 8, 15, 8, 8);
        await spriteSheet.load();

        const data = constants.level.data;
        const rows = data.length;
        const cols = data[0].length;

        const x_offset = ~~(cols / 2);
        const z_offset = ~~(rows / 2);
        for (let l = 0; l < rows; l++) {
            for (let r = 0; r < cols; r++) {
                const c = data[l][r];
                const size = [1, 1, 1];
                const position = [
                    -r + x_offset,
                    1,
                    -l + z_offset,
                ]

                this.ts.scene.add(new Tile(size, position, spriteSheet))

                if (c == 1) {
                    const item = new Item(size, position, spriteSheet);
                    this.ts.scene.add(item);
                    const block = new Block(size, position, spriteSheet);
                    this.world.addBody(block.body);
                    this.ts.scene.add(block.mesh);
                    this.entities.push(block);
                }
                else if (c == 2) {
                    const item = new Item(size, position, spriteSheet);
                    this.ts.scene.add(item);
                }
                else if (c == 3) {
                    this.hero = new Hero(size, position, spriteSheet);
                    this.world.addBody(this.hero.body);
                    this.ts.scene.add(this.hero.mesh);
                    this.entities.push(this.hero);
                }
            }
        }
        const ground = new CANNON.Body({
            type: CANNON.Body.STATIC,
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(cols, 1, rows)),
            position: new CANNON.Vec3(0, -0.5, 0),
            material: new CANNON.Material({
                friction: 0
            })
        })
        ground.updateMassProperties();
        this.world.addBody(ground);

        requestAnimationFrame((t) => this.update(t));
    }

    update(t) {
        let delta = (t - this.lastTime) * 0.001;
        delta = Math.min(delta, 0.1);
        this.lastTime = t;

        // TODO update controller
        const dir = this.controller.state.dir;
        let force = new CANNON.Vec3(dir.x, 0, dir.y)
            .scale(-1);
        this.hero.body.applyImpulse(force, this.hero.body.position);

        // TODO update physics
        this.world.step(delta);

        // TODO hero update
        for (let i = 0; i < this.entities.length; i++) {
            const e = this.entities[i];
            e.mesh.position.copy(e.body.position);
            e.mesh.quaternion.copy(e.body.quaternion);
        }
        // force hero rotation
        this.hero.body.quaternion = new CANNON.Quaternion(0, 0, 0, 1);
       
        // TODO update camera
        this.ts.camera.position.y = this.hero.mesh.position.y + 8;

        // TODO render
        // this.debugRenderer.update();
        this.ts.render(delta);
        this.controller.display();
        requestAnimationFrame((t) => this.update(t));
    }

    resize() {
        this.ts.resize();
    }

}
