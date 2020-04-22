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

        const x = ~~(Math.random() * 6) + 2
        const y = ~~(Math.random() * 2) + 10
        const tile = spriteSheet.getTile(x, y);

        const texture = new Texture(tile);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;

        const material = new MeshBasicMaterial({
            map: texture
        });
        const mesh = new Mesh(geometry, material);
        mesh.position.x = position[0];
        mesh.position.y = position[1];
        mesh.position.z = position[2];


        const box_size = new CANNON.Vec3(0.5 * size[0], 0.5 * size[2], 0.5 * size[1]); 
        const box = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            mass: 0.1,
            position: new CANNON.Vec3(position[0], position[1], position[2])
        })
        body.addShape(box)
        
        mesh.body = body;
        this.body = body;
        this.mesh = mesh;
    }
}