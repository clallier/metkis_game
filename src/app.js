import MiniConsole from './miniconsole';
import ThreeScene from './threescene';
import SpriteSheet from './spritesheet'
import TouchController from './touchcontroller';
import GLBench from 'gl-bench';

import constants from './game/constants.json';

import { Vector3 } from 'three';
import CANNON from 'cannon';
import CannonDebugRenderer from './cannondebugrenderer';
import { World } from 'ecsy';
import SceneSystem from './systems/scenesystem';
import PhysicSystem from './systems/physicsystem';
import TimerSystem from './systems/timersystem';
import EntityFactory from './game/entityfactory';
import CameraSystem from './systems/camerasystem';
import SpriteAnimationSystem from './systems/spriteanimationsystem';
import WeaponSystem from './systems/weaponsystem';
import WavesControllerSystem from './systems/wavescontrollersystem';
import MeshAnimationSystem from './systems/meshanimationsystem';
import DropSystem from './systems/dropsystem';
import GUISystem from './systems/guisystem';
import MapLevel from './pahfinding/maplevel';
import EnemyPathFindingSystem from './systems/enemypathfinding';

// main inspiration: https://twitter.com/metkis/status/1024058489860186112
// TODO 4: MeshFactory
// TODO 5: tower hud animations (creation + rotation) 
// TODO 6: screenshake, trail, explosions, impacts, "bang" on shot, particles 
// TODO 7: turret creation/upgrade/repare mechanics
// TODO 8: scene transitions
// TODO 9: entity pooling

export default class App {
    constructor() {
        new MiniConsole();
        this.lastTime = 0;
        this.ts = new ThreeScene();
        this.world = new CANNON.World();
        this.world.gravity.set(0, -10, 0);
        this.debugRenderer = new CannonDebugRenderer(this.ts.scene, this.world);
        this.controller = new TouchController();
        // GPU bench
        this.bench = new GLBench(this.ts.renderer, { trackGPU: true });

        this.ecsy = new World()
            .registerSystem(TimerSystem)
            .registerSystem(SpriteAnimationSystem)
            .registerSystem(MeshAnimationSystem)
            .registerSystem(WeaponSystem)
            .registerSystem(WavesControllerSystem)
            .registerSystem(DropSystem)
            .registerSystem(GUISystem)
            .registerSystem(CameraSystem, { camera: this.ts.camera, control: this.ts.control })
            .registerSystem(PhysicSystem, { cannon_world: this.world, controller: this.controller })
            .registerSystem(SceneSystem, { scene: this.ts.scene })

        this.spriteSheet = new SpriteSheet('resources/textures/raw_tileset01.png', 8, 15, 8, 8);
        this.ecsy.game_factory = new EntityFactory(this.ecsy, this.spriteSheet);

        window.addEventListener('resize', () => this.resize(), false);
        this.resize()
    }

    async start() {
        await this.spriteSheet.load();

        // TODO map_level MapLevel object
        const data = constants.level.data;
        const rows = data.length;
        const cols = data[0].length;
        const map_level = new MapLevel(data, ['1', '8']);
        this.ecsy.registerSystem(EnemyPathFindingSystem, {map_level});

        // TODO update map level when add turret
        const halfW = ~~(-cols / 2);
        const halfH = ~~(-rows / 2);

        // axes
        this.ecsy.game_factory.createAxes(new Vector3(halfW, 1, halfH));
        // text
        this.ecsy.game_factory.createDemoText(new Vector3(halfW, 2, halfH));
        
        for (let l = 0; l < rows; l++) {
            for (let r = 0; r < cols; r++) {
                const type = data[l][r];
                const position = new Vector3(-r, 1, -l);
                // TODO new tile sprite + new spritesheet
                this.ecsy.game_factory.createTile(position);
                this.ecsy.game_factory.create(type, position);
            }
        }
        this.ecsy.game_factory.createGround(
            new Vector3(halfW, -.5, halfH),
            new Vector3(cols, 1, rows)
        )

        requestAnimationFrame((t) => this.update(t));
    }

    update(time) {
        let delta = (time - this.lastTime) * 0.001;
        delta = Math.min(delta, 0.1);
        this.lastTime = time;
        
        // update ecs
        this.bench.begin();
        this.ecsy.execute(delta, time);

        // render
        this.render(delta);      
        this.bench.end();
        
        this.bench.nextFrame(time);
        requestAnimationFrame((t) => this.update(t));
    }

    render(delta) {
        //this.debugRenderer.update();
        this.ts.render(delta);
        if(this.controller) this.controller.display();
    }

    resize() {
        this.ts.resize();
    }
}
