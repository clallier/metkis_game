import { System } from "ecsy";
import { SpriteAnimation, ThreeMesh, CannonBody} from "../components/components";

export default class SpriteAnimationSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
    }

    init() {
    }

    execute(delta) {
        this.queries.animations.results.forEach(e => {
            const mesh = e.getComponent(ThreeMesh).value;
            const body = e.getComponent(CannonBody).value;
            let sprite_anim = e.getMutableComponent(SpriteAnimation);
            // update time
            sprite_anim.time += delta;

            if (body && body.velocity.x < -0.2) {
                this.setAnimation(mesh, sprite_anim, sprite_anim.move_right);
            }
            if (body && body.velocity.x > 0.2) {
                this.setAnimation(mesh, sprite_anim, sprite_anim.move_left);
            }

            // TODO animation time, animation_name
            if (sprite_anim.time > 1) {
                this.nextFrame(sprite_anim);
                this.setFrame(mesh, sprite_anim);
            }
        })
    }


    setAnimation(mesh, sprite_anim, new_animation) {
        if (sprite_anim.current_animation == new_animation) return;
        sprite_anim.current_animation = new_animation;
        this.setFrame(mesh, sprite_anim);
    }

    nextFrame(sprite_anim) {
        sprite_anim.frame += 1;
        sprite_anim.time = 0;
        if (sprite_anim.frame > 1)
            sprite_anim.frame = 0;
    }

    setFrame(mesh, sprite_anim) {
        mesh.material.map = sprite_anim.current_animation[sprite_anim.frame];
        mesh.material.map.needsUpdate = true;
        mesh.material.needsUpdate = true;
    }
}

SpriteAnimationSystem.queries = {
    animations: {
        components: [SpriteAnimation, ThreeMesh]
    }
}