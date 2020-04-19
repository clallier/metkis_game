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

export default class App {
    constructor() {
        new MiniConsole();
        this.lastTime = 0;
        this.ts = new ThreeScene();
        this.controller = new TouchController(
            parseInt(constants.colors.blue)
        );

        window.addEventListener('resize', () => this.resize(), false);
        this.resize()

        const axes = MeshFactory.createAxes();
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

        const x_offset = (cols / 2);
        const z_offset = (rows / 2);
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
                    this.ts.scene.add(new Block(size, position, spriteSheet))
                }
                else if (c == 2) {
                    this.ts.scene.add(new Tile(size, position, spriteSheet))
                    this.ts.scene.add(new Item(size, position, spriteSheet))
                }
                else if (c == 3) {
                    this.ts.scene.add(new Tile(size, position, spriteSheet))
                    this.hero = new Hero(size, position, spriteSheet);
                    this.ts.scene.add(this.hero);
                }
            }
        }

        requestAnimationFrame((t) => this.update(t));
    }

    update(t) {
        let delta = (t - this.lastTime) * 0.001;
        delta = Math.min(delta, 0.1);
        this.lastTime = t;
        this.ts.render(delta);


        this.hero.position.x -= (this.controller.state.dir.x * delta * 4);
        this.hero.position.z -= (this.controller.state.dir.y * delta * 4);

        this.controller.display();
        requestAnimationFrame((t) => this.update(t));
    }

    resize() {
        this.ts.resize();
    }

}
