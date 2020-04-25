import {
    BoxGeometry, Texture, MeshBasicMaterial, Mesh,
    LinearMipmapLinearFilter, NearestFilter, MeshPhongMaterial
} from "three";

import CANNON from 'cannon';

export default class Block {
    constructor(size, position, spriteSheet) {
        const geometry = new BoxGeometry(
            size[0],
            size[1],
            size[2]
        );

        // TODO function 
        const texture0 = this.createTexture(spriteSheet, {x: 3, y: 10});
        const texture1 = this.createTexture(spriteSheet);

        const material0 = new MeshBasicMaterial({ map: texture0 }) 
        const material1 = new MeshBasicMaterial({ map: texture1 })        

        const materials = [];
        materials.push(material1); // left
        materials.push(material1); // right
        materials.push(material0); // top
        materials.push(material0); // bottom
        materials.push(material1); // back
        materials.push(material1); // front
        const mesh = new Mesh(geometry, materials);
        mesh.position.set(position[0], position[1], position[2]);

        const box_size = new CANNON.Vec3(0.5 * size[0], 0.5 * size[2], 0.5 * size[1]); 
        const box = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            type: CANNON.Body.STATIC,
            mass: 0,
            position: new CANNON.Vec3(position[0], position[1], position[2]),
            material: new CANNON.Material({restitution: 0.9})
        })
        body.updateMassProperties();
        body.addShape(box)
        
        this.body = body;
        this.mesh = mesh;
    }

    createTexture(spriteSheet, options = {}) {
        const x = options.x != null? options.x: ~~(Math.random() * 6) + 2;
        const y = options.y != null? options.y: ~~(Math.random() * 2) + 10;
        const tile = spriteSheet.getTile(x, y);
        const texture = new Texture(tile);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;
        return texture;
    }
}