import {
    Texture, MeshBasicMaterial, Mesh,
    LinearMipmapLinearFilter, NearestFilter, IcosahedronGeometry, MeshToonMaterial
} from "three";

import CANNON from 'cannon';

export default class Ball {
    constructor(size, position, spriteSheet) {
        const geometry = new IcosahedronGeometry(0.4 * size[0], 1);
        const tile = spriteSheet.getTile(0, 11);

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

        const sphere = new CANNON.Sphere(0.4 * size[0]);

        const body = new CANNON.Body({
            mass: 0.01,
            position: new CANNON.Vec3(position[0], position[1], position[2]),
            material: new CANNON.Material({restitution: 0.9})
        })
        body.addShape(sphere)
        
        this.body = body;
        this.mesh = mesh;
    }
}