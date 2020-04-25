import {
    BoxGeometry, Texture, MeshBasicMaterial, Mesh,
    LinearMipmapLinearFilter, NearestFilter, MeshPhongMaterial, MeshToonMaterial
} from "three";

import CANNON from 'cannon';

export default class Crate {
    constructor(size, position, spriteSheet) {
        const geometry = new BoxGeometry(
            0.8 * size[0],
            0.8 * size[1],
            0.8 * size[2]
        );
        const tile = spriteSheet.getTile(6, 2);

        const texture = new Texture(tile);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;

        const material = new MeshToonMaterial({
            map: texture,
            shininess: 0.1
        });
        const mesh = new Mesh(geometry, material);
        mesh.position.set(position[0], position[1], position[2]);

        const box_size = new CANNON.Vec3(0.4 * size[0], 0.4 * size[2], 0.4 * size[1]); 
        const box = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            mass: 0.01,
            position: new CANNON.Vec3(position[0], position[1], position[2])
        })
        body.addShape(box)
        
        this.body = body;
        this.mesh = mesh;
    }
}