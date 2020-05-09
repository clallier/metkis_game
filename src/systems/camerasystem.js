import { System } from "ecsy";
import { CameraTarget, ThreeMesh } from "../components/components";
import { Vector3 } from "three";

export default class CameraSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
        this.camera = attributes.camera;
        this.control = attributes.control;
        this.pos_target = new Vector3();
    }

    execute() {
        // to_follow 
        this.queries.to_follow.results.forEach(e => {
            const mesh = e.getComponent(ThreeMesh).value;
            this.pos_target.copy(mesh.position);
            this.pos_target.y += 8;
            this.pos_target.z -= 8;
            this.camera.position.lerp(this.pos_target, 0.1);
            this.control.target.x = mesh.position.x;
            this.control.target.z = mesh.position.z + 8;
        })
    }

}

CameraSystem.queries = {
    to_follow: {
        components: [CameraTarget, ThreeMesh]
    }
}