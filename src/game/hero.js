import {
    CanvasTexture, LinearMipmapLinearFilter,
    NearestFilter, SpriteMaterial, Sprite, RepeatWrapping
} from "three";
import CANNON from 'cannon';

export default class Hero {
    constructor(size, position, spriteSheet) {
        this.frame = 0;
        this.time = 0;
        const canvas = []
        canvas.push(spriteSheet.getTile(0, 8));
        canvas.push(spriteSheet.getTile(7, 7));
        
        // TODO: animator
        this.anim_right = []
        this.anim_right.push(this.createTexture(canvas[0]))
        this.anim_right.push(this.createTexture(canvas[1]))
        this.anim_left = []
        this.anim_left.push(this.createTexture(canvas[0], {repeat_x:-1}))
        this.anim_left.push(this.createTexture(canvas[1], {repeat_x:-1}))
        this.anim = this.anim_left;

        const material = new SpriteMaterial({ map: this.anim[0] });
        const mesh = new Sprite(material);
        mesh.scale.set(0.8 * size[0], 0.8 * size[1], 1);
        mesh.position.x = position[0];
        mesh.position.y = position[1];
        mesh.position.z = position[2];

        const box_size = new CANNON.Vec3(0.4 * size[0], 0.4 * size[1], 0.4 * size[2]);
        const box = new CANNON.Box(box_size);

        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(position[0], position[1], position[2]),
            material: new CANNON.Material({
                friction: 0.5,
                restitution: 0.2
            })
        })
        body.addShape(box)

        mesh.body = body;
        this.body = body;
        this.mesh = mesh;
    }

    createTexture(canvas, options = {}) {
        const repeat_x = options.repeat_x != null? options.repeat_x: 1;
        const repeat_y = options.repeat_y != null? options.repeat_y: 1;
        const texture = new CanvasTexture(canvas);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.repeat.set(repeat_x, repeat_y); 
        texture.needsUpdate = true;
        return texture;
    }

    update(delta) {
        // TODO
        this.time += delta;
        if(this.body.velocity.x < -0.01) {
            this.anim = this.anim_right;
        }
        else if(this.body.velocity.x > 0.01) {
            this.anim = this.anim_left;
        }

        // TODO getFrame, changeFrame ?
        if (this.time > 1) {
            this.frame += 1;
            if (this.frame > 1) this.frame = 0;
            this.mesh.material.map = this.anim[this.frame];
            this.mesh.material.map.needsUpdate = true;
            this.mesh.material.needsUpdate = true;
            this.time = 0;
        }
        
    }
}