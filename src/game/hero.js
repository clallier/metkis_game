import {
    CanvasTexture, LinearMipmapLinearFilter,
    NearestFilter, SpriteMaterial, Sprite
} from "three";
import CANNON from 'cannon';

export default class Hero {
    constructor(size, position, spriteSheet) {

        const canvas = spriteSheet.getTile(0, 8);

        const texture = new CanvasTexture(canvas);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;

        const material = new SpriteMaterial({ map: texture });
        
        const mesh = new Sprite(material);
        mesh.scale.set(0.8 * size[0], 0.8 * size[1], 1);
        mesh.position.x = position[0];
        mesh.position.y = position[1];
        mesh.position.z = position[2];

        const box_size = new CANNON.Vec3(0.5 * size[0], 0.5 * size[1], 0.5 * size[2]); 
        const box = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(position[0], position[1], position[2]),
            material: new CANNON.Material({
                friction: 1,
                restitution:0.2
            })
        })
        body.addShape(box)
        
        mesh.body = body;
        this.body = body;
        this.mesh = mesh;
    }
}