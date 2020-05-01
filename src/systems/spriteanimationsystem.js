import { System } from "ecsy";
import { SpriteAnimation, ThreeMesh, CannonBody } from "../components/components";

export default class SpriteAnimationSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
    }

    init() {
        console.log('init from SpriteAnimationSytem')
    }

    execute(delta) {
        this.queries.animations.results.forEach(e => {
            const mesh = e.getComponent(ThreeMesh).value;
            const body = e.getComponent(CannonBody).value;
            let animation = e.getMutableComponent(SpriteAnimation);
            // update time
            animation.time += delta;

            if (body && body.velocity.x < -0.01) {
                this.setAnimation(mesh, animation, animation.move_right);
            }
            if (body && body.velocity.x > 0.01) {
                this.setAnimation(mesh, animation, animation.move_left);
            }

            // TODO animation time, animation_name
            if (animation.time > 1) {
                this.nextFrame(animation);
                this.setFrame(mesh, animation);
            }
        })
    }


    setAnimation(mesh, animation, animation_name) {
        if (animation.current_animation == animation_name) return;
        animation.current_animation = animation_name;
        this.setFrame(mesh, animation);
    }

    nextFrame(animation) {
        animation.frame += 1;
        animation.time = 0;
        if (animation.frame > 1)
            animation.frame = 0;
    }

    setFrame(mesh, animation) {
        mesh.material.map = animation.current_animation[animation.frame];
        mesh.material.map.needsUpdate = true;
        mesh.material.needsUpdate = true;
    }
}

SpriteAnimationSystem.queries = {
    animations: {
        components: [SpriteAnimation, ThreeMesh]
    }
}