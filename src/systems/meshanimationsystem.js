import { System } from "ecsy";
import { MeshAnimation, ThreeMesh, ChangeAnimation } from "../components/components";

export default class MeshAnimationSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
    }

    init() {
    }

    execute(delta) {

        // change animation
        this.queries.change_animation.added.forEach(e => {
            const mesh_anim = e.getComponent(MeshAnimation);
            const change = e.getComponent(ChangeAnimation);
            if (change != null)
                this.setAnimation(mesh_anim, change);
            e.removeComponent(ChangeAnimation);
        })


        this.queries.animations.results.forEach(e => {
            let mesh_anim = e.getMutableComponent(MeshAnimation);
            // update time
            mesh_anim.time += delta;

            // TODO : cleanup?
            if (mesh_anim.current_animation_duration > 0 &&
                mesh_anim.time > mesh_anim.current_animation_duration)
                this.setAnimationToIdle(mesh_anim)

            mesh_anim.current_animation(mesh_anim.time, mesh_anim.target);
        })
    }

    setAnimation(mesh_anim, change) {
        if(mesh_anim.current_animation != change.current_animation)        
            mesh_anim.time = 0;
            
        mesh_anim.current_animation = change.current_animation;
        mesh_anim.current_animation_duration = change.current_animation_duration;
        mesh_anim.target = change.target;
    }

    setAnimationToIdle(mesh_anim) {
        mesh_anim.current_animation = mesh_anim.idle;
        mesh_anim.current_animation_duration = 0;
        mesh_anim.target = null;
        mesh_anim.time = 0;
    }
}

MeshAnimationSystem.queries = {
    animations: {
        components: [MeshAnimation, ThreeMesh]
    },
    change_animation: {
        components: [ChangeAnimation],
        listen: {
            added: [MeshAnimation, ThreeMesh]
        }
    }
}