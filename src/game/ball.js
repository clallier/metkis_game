import {
    Texture, MeshBasicMaterial, Mesh,
    LinearMipmapLinearFilter, NearestFilter, IcosahedronGeometry
} from "three";

import CANNON from 'cannon';

export default class Ball {
    constructor(size, position, spriteSheet) {
        const geometry = new IcosahedronGeometry(0.5 * size[0], 1);
        const tile = spriteSheet.getTile(6, 2);

        const texture = new Texture(tile);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;

        const material = new MeshBasicMaterial({
            map: texture
        });
        const mesh = new Mesh(geometry, material);
        mesh.scale.set(0.8 * size[0], 0.8 * size[1], 0.8 * size[2]);
        mesh.position.x = position[0];
        mesh.position.y = position[1];
        mesh.position.z = position[2];


        const sphere = new CANNON.Sphere(0.4 * size[0]);

        const body = new CANNON.Body({
            mass: 0.01,
            position: new CANNON.Vec3(position[0], position[1], position[2]),
            material: new CANNON.Material({restitution: 0.9})
        })
        body.addShape(sphere)
        
        mesh.body = body;
        this.body = body;
        this.mesh = mesh;
    }
}