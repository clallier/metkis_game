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
        const texture0 = this.createRandomTexture(spriteSheet);
        const texture1 = this.createRandomTexture(spriteSheet);

        const materials = [];
        materials.push(new MeshBasicMaterial({map: texture1})); // left
        materials.push(new MeshBasicMaterial({map: texture1})); // right
        materials.push(new MeshBasicMaterial({map: texture0})); // top
        materials.push(new MeshBasicMaterial({map: texture0})); // bottom
        materials.push(new MeshBasicMaterial({map: texture1})); // back
        materials.push(new MeshBasicMaterial({map: texture1})); // front
        const mesh = new Mesh(geometry, materials);
        mesh.position.x = position[0];
        mesh.position.y = position[1];
        mesh.position.z = position[2];


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
        
        mesh.body = body;
        this.body = body;
        this.mesh = mesh;
    }

    createRandomTexture(spriteSheet, options = {}) {
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