import MeshFactory from '../meshfactory';
import CANNON from 'cannon';
import {
    Vector3, PlaneGeometry, MeshBasicMaterial, BoxGeometry,
    CanvasTexture, SpriteMaterial, Sprite, MeshToonMaterial,
    IcosahedronGeometry, OctahedronGeometry, Texture,
    LinearMipmapLinearFilter, NearestFilter, Mesh, RepeatWrapping
} from "three";

import {
    ThreeMesh, CannonBody, DeleteAfter, CameraTarget, Controllable, SpriteAnimation
} from "../components/components";


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

    create(type = 1, position = new Vector3()) {
        if (type == 1) {
            this.createBlock(position)
        }
        else if (type == 2) {
            this.createItem(position)
        }
        else if (type == 3) {
            this.createHero(position)
        }
        if (type == 4) {
            this.createCrate(position)
        }
        if (type == 5) {
            this.createBall(position)
        }
        if (type == 6) {
            this.createEnemy(position)
        }
    }

    createAxes() {
        const axesMesh = MeshFactory.createAxes(new Vector3(0, 1, 0))

        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: axesMesh })
    }

    createDemoText() {
        // text
        const sprite = MeshFactory.createText(
            new Vector3(0, 2, 0),
            "READY TO 🍪?!")

        this.ecsy.createEntity()
            .addComponent(DeleteAfter, { seconds: 2 })
            .addComponent(ThreeMesh, { value: sprite })

    }

    createTile(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        const geometry = new PlaneGeometry(size.x, size.y, 1, 1);

        const x = ~~(Math.random() * 2) + 4
        const y = 14
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
        const material1 = new MeshBasicMaterial({
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
            material: new CANNON.Material({ restitution: 1 })
        })
        body.updateMassProperties();
        body.addShape(box)

        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: mesh })
            .addComponent(CannonBody, { value: body })

    }

    createItem(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        const material = new SpriteMaterial({
            map: this.createTexture(0, 9)
        });
        const mesh = new Sprite(material);
        mesh.scale.set(0.8 * size.x, 0.8 * size.y, 1);
        mesh.position.copy(position);

        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: mesh })
    }

    createHero(position = new Vector3(), size = new Vector3(1, 1, 1)) {
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

        const box_size = new CANNON.Vec3(0.4 * size.x, 0.4 * size.y, 0.4 * size.z);
        const shape = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            mass: 1,
            position: position,
            fixedRotation: true,
            material: new CANNON.Material({
                friction: 0.5,
                restitution: 0.5
            })
        })
        body.addShape(shape)

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
    }

    createCrate(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        const geometry = new BoxGeometry(
            0.8 * size.x,
            0.8 * size.y,
            0.8 * size.z
        );
        const material = new MeshToonMaterial({
            map: this.createTexture(6, 2),
            shininess: 0.2
        });
        const mesh = new Mesh(geometry, material);
        mesh.position.copy(position);

        const box_size = new CANNON.Vec3(0.4 * size.x, 0.4 * size.y, 0.4 * size.z);
        const box = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            mass: 0.01,
            position: position
        })
        body.addShape(box)

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
            mass: 1,
            position: position,
            material: new CANNON.Material({ restitution: 0.9 })
        })
        body.addShape(sphere)

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
                friction: 0
            })
        })
        body.updateMassProperties();

        this.ecsy.createEntity()
            .addComponent(CannonBody, { value: body })
    }

    createEnemy(position = new Vector3(), size = new Vector3(1, 1, 1)) {
        const material = new SpriteMaterial({
            map: this.createTexture(2, 9)
        });
        const mesh = new Sprite(material);
        mesh.scale.set(0.8 * size.x, 0.8 * size.y, 1);
        mesh.position.copy(position);

        const box_size = new CANNON.Vec3(0.4 * size.x, 0.4 * size.y, 0.4 * size.z);
        const box = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            mass: 1,
            position: position,
            fixedRotation: true,
            material: new CANNON.Material({
                friction: 0,
                restitution: 0.9
            })
        })
        body.addShape(box);

        this.ecsy.createEntity()
            .addComponent(ThreeMesh, { value: mesh })
            .addComponent(CannonBody, { value: body })
    }

    createBullet(position = new Vector3(), size = new Vector3(1, 1, 1), impulse = new Vector3()) {
        // TODO : sprite
        const geometry = new OctahedronGeometry(0.2 * size.x, 1);
        const material = new MeshToonMaterial({
            map: this.createTexture(0, 11)
        });
        const mesh = new Mesh(geometry, material);
        mesh.position.copy(position);

        const shape = new CANNON.Sphere(0.1 * size.x);
        const body = new CANNON.Body({
            mass: 0.1,
            position: position,
            fixedRotation: true
        })
        body.addShape(shape);
        // TODO applyImpulse component ?
        body.applyImpulse(direction, body.position);

        // TODO add it in physicssystem + component
        body.addEventListener('collide', (e) => this.collide(e))

        this.ecsy.createEntity()
            .addComponent(DeleteAfter, { seconds: 1 })
            .addComponent(ThreeMesh, { value: mesh })
            .addComponent(CannonBody, { value: body })
    }
} 