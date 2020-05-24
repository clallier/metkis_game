import { System } from "ecsy";
import { MeshAnimation, ThreeMesh } from "../components";

export default class MeshAnimationSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
    }

    init() {
    }

    execute(delta) {

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
    }
}