import {
    CanvasTexture, LinearMipmapLinearFilter,
    NearestFilter, SpriteMaterial, Sprite, Vector3
} from "three";

import CANNON from 'cannon';

export default class Enemy {
    constructor(size, position, spriteSheet) {
        this.time = 0
        const tile = spriteSheet.getTile(2, 9);

        const texture = new CanvasTexture(tile);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;

        const material = new SpriteMaterial({ map: texture });
        const mesh = new Sprite(material);
        mesh.scale.set(0.8 * size[0], 0.8 * size[1], 1);
        mesh.position.x = position[0];
        mesh.position.y = position[1];
        mesh.position.z = position[2];

        const box_size = new CANNON.Vec3(0.4 * size[0], 0.4 * size[1], 0.4 * size[2]);
        const box = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(position[0], position[1], position[2])
        })

        body.addShape(box);

        this.body = body;
        this.mesh = mesh;
    }
}