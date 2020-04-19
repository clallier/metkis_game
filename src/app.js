import MiniConsole from './miniconsole';
import ThreeScene from './threescene';
import MeshFactory from './meshfactory';
import SpriteSheet from './spritesheet'
import TouchController from './touchcontroller';

import constants from './game/constants.json';
import Block from './game/block';
import Tile from './game/tile';
import Item from './game/item';
import Hero from './game/hero';
import EntityArray from './entityarray';
import { Raycaster, Vector3 } from 'three';

export default class App {
    constructor() {
        new MiniConsole();
        this.lastTime = 0;
        this.ts = new ThreeScene();
        this.controller = new TouchController(
            parseInt(constants.colors.blue)
        );
        this.entities = new EntityArray();

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

                if (c == 0) {
                    this.ts.scene.add(new Tile(size, position, spriteSheet))
                }
                else if (c == 1) {
                    const block = new Block(size, position, spriteSheet);
                    this.entities.add(block)
                    this.ts.scene.add(block);
                }
                else if (c == 2) {
                    this.ts.scene.add(new Tile(size, position, spriteSheet))
                    const item = new Item(size, position, spriteSheet);
                    this.ts.scene.add(item);
                }
                else if (c == 3) {
                    this.ts.scene.add(new Tile(size, position, spriteSheet))
                    this.hero = new Hero(size, position, spriteSheet);
                    this.ts.scene.add(this.hero);
                }
            }
        }
        this.entities.mergeAddQueue();

        requestAnimationFrame((t) => this.update(t));
    }

    update(t) {
        let delta = (t - this.lastTime) * 0.001;
        delta = Math.min(delta, 0.1);
        this.lastTime = t;
        this.ts.render(delta);

        const dir = this.controller.state.dir;
        const velocity = new Vector3(dir.x, 0, dir.y)
            .multiplyScalar(-delta * 2);

        const vel_norm = velocity.clone().normalize();
        const length = velocity.length() + 0.5;

        var ray = new Raycaster(this.hero.position, vel_norm);
        var res = ray.intersectObjects(this.entities.array);
        for (let i = 0; i < res.length; i++) {
            const r = res[i];
            if (r.distance < length) {
                velocity.clampLength(0, 0);

                console.log(velocity);
            }
        }
        this.hero.position.x += velocity.x;
        this.hero.position.z += velocity.z;
        this.controller.display();
        requestAnimationFrame((t) => this.update(t));
    }

    resize() {
        this.ts.resize();
    }

}
