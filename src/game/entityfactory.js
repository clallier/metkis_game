import MeshFactory from '../meshfactory';
import CANNON from 'cannon';
import {
    Vector3, PlaneGeometry, MeshBasicMaterial, BoxGeometry,
    SpriteMaterial, Sprite, MeshToonMaterial,
    IcosahedronGeometry, Texture,
    LinearMipmapLinearFilter, NearestFilter, Mesh, RepeatWrapping, CylinderGeometry
} from "three";

import {
    ThreeMesh, CannonBody, DeleteAfter, CameraTarget, Controllable,
    GroupEnemy, GroupPlayer, SpriteAnimation, Damageable, DistanceWeapon,
    ApplyImpulse, Collider, SpawnEnemies, MeshAnimation, DroppableOnDeath, Inventory,
    Pickupable, GUI, PathFinding
} from "../components/components";

import constants from "../game/constants.json";
import Turret from './turret';

// https://github.com/schteppe/cannon.js/blob/master/demos/collisionFilter.html
const COLLISION_GROUP = {
    PLAYER: 1,
    NEUTRAL: 2,
    ENEMY: 4,
    ALL: 1 | 2 | 4
}

// TODO : convert it to system ?
export default class EntityFactory {
    constructor(ecsy, spriteSheet) {
        this.ecsy = ecsy;
        this.spriteSheet = spriteSheet;
    }

    createTexture(x, y, options = {}) {
        const tile = this.spriteSheet.getTile(x, y);
        const texture = new Texture(tile);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;
        // repeat texture
        let r_x = options.repeat_x;
        let r_y = options.repeat_y;
        if (r_x || r_y) {
            r_x = r_x != null ? r_x : .99;
            r_y = r_y != null ? r_y : .99;
            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(r_x, r_y);
        }
        return texture;
    }

    create(type = '1', position = new Vector3()) {
        if (type == '1') {
            this.createBlock(position)
        }
        else if (type == '2') {
            this.createItem(position)
        }
        else if (type == '3') {
            this.createPlayer(position)
        }
        if (type == '4') {
            this.createCrate(position)
        }
        if (type == '5') {
            this.createBall(position)
        }
        if (type == '6') {
            this.createEnemy(position)
        }
        if (type == '7') {
            this.createSpawnPoint(position)
        }
        if (type == '8') {
            this.createTurret(position)
        }
        if (type == '9') {
            this.createGenerator(position)
        }
    }

    createAxes(position = new Vector3(0, 1, 0)) {
        const axesMesh = MeshFactory.createAxes(position);

        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: axesMesh })
    }

    createDemoText(position = new Vector3(0, 2, 0)) {
        // text
        const sprite = MeshFactory.createText(
            position,
            "READY TO 🍪?!")

        this.ecsy.createEntity()
            .addComponent(DeleteAfter, { seconds: 2 })
            .addComponent(ThreeMesh, { value: sprite })

    }

    createTile(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        const geometry = new PlaneGeometry(size.x, size.y, 1, 1);

        const x = ~~(Math.random() * 2) + 4
        const y = 0
        const material = new MeshBasicMaterial({
            map: this.createTexture(x, y)
        });

        const mesh = new Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.position.y -= .5;
        mesh.rotation.x = -Math.PI / 2;

        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: mesh })
    }

    createBlock(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        const geometry = new BoxGeometry(size.x, size.y, size.z);
        const material0 = new MeshBasicMaterial({
            map: this.createTexture(3, 10)
        })
        const material1 = new MeshToonMaterial({
            map: this.createTexture(2, 10)
        })

        const materials = [];
        materials.push(material1); // left
        materials.push(material1); // right
        materials.push(material0); // top
        materials.push(material0); // bottom
        materials.push(material1); // back
        materials.push(material1); // front
        const mesh = new Mesh(geometry, materials);
        mesh.position.copy(position);

        const box_size = new CANNON.Vec3(0.5 * size.x, 0.5 * size.y, 0.5 * size.z);
        const box = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            type: CANNON.Body.STATIC,
            mass: 0,
            position: position,
            shape: box,
            material: new CANNON.Material({
                friction: constants.friction.block,
                restitution: constants.restitution.block
            }),
            // put it in neutral group
            collisionFilterGroup: COLLISION_GROUP.NEUTRAL,
            // it can collide with all groups
            collisionFilterMask: COLLISION_GROUP.ALL
        })
        body.updateMassProperties();

        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: mesh })
            .addComponent(CannonBody, { value: body })

    }

    createItem(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        const material = new SpriteMaterial({
            map: this.createTexture(6, 8)
        });
        const mesh = new Sprite(material);
        mesh.scale.set(0.8 * size.x, 0.8 * size.y, 1);
        mesh.position.copy(position);

        const box_size = new CANNON.Vec3(0.2 * size.x, 0.2 * size.y, 0.2 * size.z);
        const shape = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            mass: 0.1,
            position: position,
            shape: shape,
            fixedRotation: true,
            material: new CANNON.Material({
                friction: constants.friction.player,
                restitution: constants.restitution.player
            }),
            // put it in neutral group
            collisionFilterGroup: COLLISION_GROUP.NEUTRAL,
            // it can collide with player group
            collisionFilterMask: COLLISION_GROUP.PLAYER | COLLISION_GROUP.NEUTRAL
        })

        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: mesh })
            .addComponent(CannonBody, { value: body })
            .addComponent(Inventory, { money: 1 })
            .addComponent(Pickupable)
    }

    createPlayer(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        const move_right = []
        move_right.push(this.createTexture(0, 8));
        move_right.push(this.createTexture(7, 7));

        const move_left = []
        move_left.push(this.createTexture(0, 8, { repeat_x: -.99 }))
        move_left.push(this.createTexture(7, 7, { repeat_x: -.99 }))
        const current_animation = move_left;

        const material = new SpriteMaterial({ map: current_animation[0] });
        const mesh = new Sprite(material);
        mesh.scale.set(0.8 * size.x, 0.8 * size.y, size.z);
        mesh.position.copy(position);

        const shape = new CANNON.Sphere(0.4 * size.x);

        const body = new CANNON.Body({
            mass: 1,
            position: position,
            shape: shape,
            fixedRotation: true,
            material: new CANNON.Material({
                friction: constants.friction.player,
                restitution: constants.restitution.player
            }),
            // put it in player group
            collisionFilterGroup: COLLISION_GROUP.PLAYER,
            // it can collide with all groups
            collisionFilterMask: COLLISION_GROUP.ALL
        })

        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: mesh })
            .addComponent(CannonBody, { value: body })
            .addComponent(CameraTarget)
            .addComponent(Controllable)
            .addComponent(SpriteAnimation, {
                move_left,
                move_right,
                current_animation
            })
            .addComponent(GroupPlayer)
            .addComponent(Inventory)
            .addComponent(DistanceWeapon)
    }

    createCrate(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        const geometry = new BoxGeometry(
            0.8 * size.x,
            0.8 * size.y,
            0.8 * size.z
        );
        const material = new MeshToonMaterial({
            map: this.createTexture(6, 10),
            shininess: 0.2
        });
        const mesh = new Mesh(geometry, material);
        mesh.position.copy(position);

        const box_size = new CANNON.Vec3(0.4 * size.x, 0.4 * size.y, 0.4 * size.z);
        const box = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            mass: 0.01,
            position: position,
            shape: box,
            // put it in neutral group
            collisionFilterGroup: COLLISION_GROUP.NEUTRAL,
            // it can collide with all groups
            collisionFilterMask: COLLISION_GROUP.ALL
        })

        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: mesh })
            .addComponent(CannonBody, { value: body })
    }

    createBall(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        const geometry = new IcosahedronGeometry(0.4 * size.x, 1);
        const material = new MeshToonMaterial({
            map: this.createTexture(0, 11),
            shininess: 0.1
        });
        const mesh = new Mesh(geometry, material);
        mesh.position.copy(position);

        const sphere = new CANNON.Sphere(0.4 * size.x);
        const body = new CANNON.Body({
            mass: 0.1,
            position: position,
            shape: sphere,
            material: new CANNON.Material({ restitution: 0.9 }),
            // put it in neutral group
            collisionFilterGroup: COLLISION_GROUP.NEUTRAL,
            // it can collide with all groups
            collisionFilterMask: COLLISION_GROUP.ALL
        })

        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: mesh })
            .addComponent(CannonBody, { value: body })
    }

    createGround(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        const body = new CANNON.Body({
            type: CANNON.Body.STATIC,
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(.5 * size.x, 1, .5 * size.z)),
            position: position,
            material: new CANNON.Material({
                friction: constants.friction.ground
            }),
            // put it in neutral group
            collisionFilterGroup: COLLISION_GROUP.NEUTRAL,
            // it can collide with all groups
            collisionFilterMask: COLLISION_GROUP.ALL
        })
        body.updateMassProperties();

        this.ecsy.createEntity()
            .addComponent(CannonBody, { value: body })
    }

    createSpawnPoint(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        // TODO if it stays a box => merge code with createBlock
        const geometry = new BoxGeometry(size.x, size.y, size.z);
        const material0 = new MeshBasicMaterial({
            map: this.createTexture(4, 2)
        })
        const material1 = new MeshBasicMaterial({
            map: this.createTexture(6, 1)
        })

        const materials = [];
        materials.push(material1); // left
        materials.push(material1); // right
        materials.push(material0); // top
        materials.push(material0); // bottom
        materials.push(material1); // back
        materials.push(material1); // front
        const mesh = new Mesh(geometry, materials);
        mesh.position.copy(position);

        const box_size = new CANNON.Vec3(0.5 * size.x, 0.5 * size.y, 0.5 * size.z);
        const box = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            type: CANNON.Body.STATIC,
            mass: 0,
            position: position,
            shape: box,
            material: new CANNON.Material({
                friction: constants.friction.block,
                restitution: constants.restitution.block
            }),
            // put it in enemy group
            collisionFilterGroup: COLLISION_GROUP.ENEMY,
            // it can collide with player or neutral
            collisionFilterMask: COLLISION_GROUP.PLAYER | COLLISION_GROUP.NEUTRAL
        })
        body.updateMassProperties();

        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: mesh })
            .addComponent(CannonBody, { value: body })
            .addComponent(SpawnEnemies)
    }

    createEnemy(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        const material = new SpriteMaterial({
            map: this.createTexture(2, 9)
        });
        const mesh = new Sprite(material);
        mesh.scale.set(0.8 * size.x, 0.8 * size.y, 1);
        mesh.position.copy(position);

        const sphere = new CANNON.Sphere(0.4 * size.x);
        const body = new CANNON.Body({
            mass: 1,
            position: position,
            shape: sphere,
            fixedRotation: true,
            material: new CANNON.Material({
                friction: 0.5,
                restitution: 0.9
            }),
            // put it in collisionGroup
            collisionFilterGroup: COLLISION_GROUP.ENEMY,
            // it can collide with all groups
            collisionFilterMask: COLLISION_GROUP.ALL

        })

        const loot = (position) => this.createItem(position);
        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: mesh })
            .addComponent(CannonBody, { value: body })
            .addComponent(DroppableOnDeath, { item: loot })
            .addComponent(GroupEnemy)
            .addComponent(Damageable)
            .addComponent(PathFinding)
    }

    createBullet(position = new Vector3(), impulse = new Vector3(),
        collisionGroup = COLLISION_GROUP.PLAYER,
        collisionMask = COLLISION_GROUP.NEUTRAL | COLLISION_GROUP.ENEMY,
        size = new Vector3(1, 1, 1)) {
        const material = new SpriteMaterial({
            map: this.createTexture(4, 3)
        });
        const mesh = new Sprite(material);
        mesh.scale.set(0.8 * size.x, 0.8 * size.y, 1);
        mesh.position.copy(position);

        const shape = new CANNON.Sphere(0.1 * size.x);
        const body = new CANNON.Body({
            mass: 0.1,
            position: position,
            shape: shape,
            fixedRotation: true,
            // put the bullet in collisionGroup (default: player group)
            collisionFilterGroup: collisionGroup,
            // it can only collide with groups in collisionMask
            // default: enemy or neutral group
            collisionFilterMask: collisionMask
        })

        this.ecsy.createEntity()
            .addComponent(DeleteAfter, { seconds: 1 })
            .addComponent(ThreeMesh, { value: mesh })
            .addComponent(CannonBody, { value: body })
            .addComponent(Collider)
            .addComponent(ApplyImpulse, {
                impulse: impulse,
                point: body.position
            })
    }

    createTurret(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        const turret = new Turret(position);
        const box_size = new CANNON.Vec3(0.5 * size.x, 0.5 * size.y, 0.5 * size.z);
        const box = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            type: CANNON.Body.STATIC,
            mass: 0,
            position: position,
            shape: box,
            material: new CANNON.Material({
                friction: constants.friction.block,
                restitution: constants.restitution.block
            }),
            // put the bullet in collisionGroup
            collisionFilterGroup: COLLISION_GROUP.PLAYER,
            // it can collide with all groups
            collisionFilterMask: COLLISION_GROUP.ALL
        })
        body.updateMassProperties();

        const idle = (time) => turret.idleAnimation(time);
        const attack = (time, target) => turret.attackAnimation(time, target);
        const current_animation = idle;

        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: turret.mesh })
            .addComponent(CannonBody, { value: body })
            .addComponent(GroupPlayer)
            .addComponent(DistanceWeapon)
            .addComponent(MeshAnimation, {
                idle,
                attack,
                current_animation
            })
            .addComponent(GUI, {
                infos: new Map([
                    ['description', 'I turret !'],
                    ['kpi', .75]
                ])
            })
    }

    createGenerator(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        // TODO if it stays a box => merge code with createBlock
        var geometry = new CylinderGeometry(
            size.x * .3,
            size.x * .5,
            size.y,
            8);

        const material = new MeshToonMaterial({
            map: this.createTexture(7, 10)
        })
        const mesh = new Mesh(geometry, material);
        mesh.position.copy(position);

        const box_size = new CANNON.Vec3(0.5 * size.x, 0.5 * size.y, 0.5 * size.z);
        const box = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            type: CANNON.Body.STATIC,
            mass: 0,
            position: position,
            shape: box,
            material: new CANNON.Material({
                friction: constants.friction.block,
                restitution: constants.restitution.block
            }),
            // put it in player group
            collisionFilterGroup: COLLISION_GROUP.PLAYER,
            // it can collide with all
            collisionFilterMask: COLLISION_GROUP.ALL
        })
        body.updateMassProperties();

        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: mesh })
            .addComponent(CannonBody, { value: body })
    }
} 