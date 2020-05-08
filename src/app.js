import MiniConsole from './miniconsole';
import ThreeScene from './threescene';
import SpriteSheet from './spritesheet'
import TouchController from './touchcontroller';

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

// main inspiration: https://twitter.com/metkis/status/1024058489860186112
// TODO 3: pickup (ex: money)
    // Drop OK
    // if player is not close => do nothing 
    // if player is close => the "money" should be attracted by the player
    // if player collide with "money" => add money to the player inventory + remove from the map
    
    // PickupSystem
    // query 0 : player
    // query 1 : pickupable => foreach
    // 1) get dist from player to pickupable
    // 2) if dist < given radius => apply force to the item in order to get closer to the player
    // 3) if dist < small radius => remove item + add money to the inventory component of the player
    //   

// TODO 4: activate towers
    // Quand on s'approche d'une tourrelle => affichage d'une texture en mode "holographique"
    // qui contienne les infos de la tourelle : 
    // Ex : description, type, hp, argent dispo, level, progression au niveau superieur, tirs par secondes 
    

    // InfoSystem
    // query 0 : player
    // query 1 : gui component => foreach
        // added => creation de la texture à partir des infos du composant
        // pour les infos statiques => créées à l'initialisation
        // pour les infos dynamiques, comment les récuperer ?
// TODO 5: tower animations (creation + rotation) 
// TODO 6: screenshake, trail, explosions, impacts, "bang" on shot 

export default class App {
    constructor() {
        new MiniConsole();
        this.lastTime = 0;
        this.ts = new ThreeScene();
        this.world = new CANNON.World();
        this.world.gravity.set(0, -10, 0);
        this.debugRenderer = new CannonDebugRenderer(this.ts.scene, this.world);
        this.controller = new TouchController();

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

        // axes
        this.ecsy.game_factory.createAxes();

        // text
        this.ecsy.game_factory.createDemoText();
    }

    async start() {
        await this.spriteSheet.load();

        const data = constants.level.data;
        const rows = data.length;
        const cols = data[0].length;

        const x_offset = ~~(cols / 2);
        const z_offset = ~~(rows / 2);
        for (let l = 0; l < rows; l++) {
            for (let r = 0; r < cols; r++) {
                const type = data[l][r];
                const position = new Vector3(-r + x_offset, 1, -l + z_offset);
                // TODO new tile sprite
                this.ecsy.game_factory.createTile(position);
                this.ecsy.game_factory.create(type, position);
            }
        }
        this.ecsy.game_factory.createGround(
            new Vector3(0, -.5, 0.5),
            new Vector3(cols, 1, rows)
        )

        requestAnimationFrame((t) => this.update(t));
    }

    update(time) {
        let delta = (time - this.lastTime) * 0.001;
        delta = Math.min(delta, 0.1);
        this.lastTime = time;       
        this.ecsy.execute(delta, time);
        // TODO render
        // this.debugRenderer.update();
        this.ts.render(delta);
        if(this.controller) this.controller.display();
        requestAnimationFrame((t) => this.update(t));
    }

    resize() {
        this.ts.resize();
    }

}
