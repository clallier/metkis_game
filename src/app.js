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
import Crate from './game/crate';
import Ball from './game/ball';
import Enemy from './game/enemy';
import Bullet from './game/bullet';

import { Vector3 } from 'three';
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
        // TODO const
        this.spriteSheet = new SpriteSheet('resources/textures/raw_tileset01.png', 8, 15, 8, 8);
        await this.spriteSheet.load();
        const spriteSheet = this.spriteSheet;

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
                    const block = new Block(size, position, spriteSheet);
                    this.world.addBody(block.body);
                    this.ts.scene.add(block.mesh);
                    this.entities.push(block);
                }
                else if (c == 2) {
                    const item = new Item(size, position, spriteSheet);
                    this.ts.scene.add(item.mesh);
                }
                else if (c == 3) {
                    this.hero = new Hero(size, position, spriteSheet);
                    this.world.addBody(this.hero.body);
                    this.ts.scene.add(this.hero.mesh);
                    this.entities.push(this.hero);
                }
                if (c == 4) {
                    const crate = new Crate(size, position, spriteSheet);
                    this.world.addBody(crate.body);
                    this.ts.scene.add(crate.mesh);
                    this.entities.push(crate);
                }
                if (c == 5) {
                    const ball = new Ball(size, position, spriteSheet);
                    this.world.addBody(ball.body);
                    this.ts.scene.add(ball.mesh);
                    this.entities.push(ball);
                }
                if (c == 6) {
                    this.enemy = new Enemy(size, position, spriteSheet);
                    this.world.addBody(this.enemy.body);
                    this.ts.scene.add(this.enemy.mesh);
                    this.entities.push(this.enemy);
                }
            }
        }
        const ground = new CANNON.Body({
            type: CANNON.Body.STATIC,
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(.5 * cols, 1, .5 * rows)),
            position: new CANNON.Vec3(0, -0.5, 0.5),
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
            .scale(-0.5);
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
        // this.hero.body.quaternion = new CANNON.Quaternion(0, 0, 0, 1);
        this.hero.update(delta);

        // TODO enemy update
        this.enemy.time += delta;
    
        if(this.enemy.time > 0.1) {
            this.enemy.time = 0;
            // fire
            // TODO position, velocity
            // add to physics
            // add to render
            // edit collision
            // TODO pas sur por le new ou  le create p-e clone une instance
            // TODO spriteSheet
            const radius = 1;
            const enemy_pos = this.enemy.mesh.position.clone();
            const spriteSheet = this.spriteSheet;
            const direction = this.hero.mesh.position.clone()
                .sub(enemy_pos)
                .normalize();
            const position = [enemy_pos.x + direction.x, 1, enemy_pos.z + direction.z];
            direction.setLength(1.5);
            direction.y = 1;
            const bullet = new Bullet(radius, position, spriteSheet);
            this.world.addBody(bullet.body);
            this.ts.scene.add(bullet.mesh);
            this.entities.push(bullet);
            bullet.body.applyImpulse(direction, bullet.body.position);
        }
    
       
        // TODO update camera
        this.ts.camera.position.x = this.hero.mesh.position.x;
        this.ts.camera.position.y = this.hero.mesh.position.y + 8;
        this.ts.camera.position.z = this.hero.mesh.position.z - 8;
        this.ts.control.target.z = this.hero.mesh.position.z + 8;


        // TODO render
        this.debugRenderer.update();
        this.ts.render(delta);
        this.controller.display();
        requestAnimationFrame((t) => this.update(t));
    }

    resize() {
        this.ts.resize();
    }

}
