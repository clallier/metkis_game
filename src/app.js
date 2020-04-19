import constants from './constants.json';
import MiniConsole from './miniconsole';
import ThreeScene from './threescene';
import MeshFactory from './meshfactory';
import Block from './block';
import SpriteSheet from './spritesheet'

export default class App {
    constructor() {
        new MiniConsole();
        this.ts = new ThreeScene();

        window.addEventListener('resize', () => this.resize(), false);
        this.resize()

        const axes = MeshFactory.createAxes();
        this.ts.scene.add(axes);

        const text = MeshFactory.createText("READY TO 🍪?!");
        text.position.y = 2 * constants.scale;
        this.ts.scene.add(text);

    }

    async start() {
        const spriteSheet = new SpriteSheet('resources/textures/raw_tileset01.png', 8, 15, 8, 8);
        await spriteSheet.load();
        
        const scale = constants.scale;
        const data = constants.level.data;
        const rows = data.length;
        const cols = data[0].length;

        const x_offset = (cols / 2) * scale;
        const z_offset = (rows / 2) * scale;
        console.log(x_offset, z_offset);
        for(let l=0; l<rows; l++){
            for(let r=0; r<cols; r++){
                const c = data[l][r];
                const size = [scale, scale, scale];
                const position = [
                    -r * scale + x_offset, 
                    1,
                    -l * scale + z_offset,
                ]

                if(c == 0) {} 
                if(c == 1) 
                this.ts.scene.add(new Block(size, position, spriteSheet))
            }
        }

        requestAnimationFrame((t) => this.update(t));
    }

    update(t) {
        const delta = (t - this.lastTime) * 0.001;
        this.lastTime = t;
        this.ts.render(delta);
        requestAnimationFrame((t) => this.update(t));
    }

    resize() {
        this.ts.resize();
    }

}
