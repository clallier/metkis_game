import { System } from "ecsy";
import { CameraTarget, ThreeMesh } from "../components/components";

export default class CameraSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
        this.camera = attributes.camera;
        this.control = attributes.control;
    }

    execute() {
        // to_follow 
        this.queries.to_follow.results.forEach(e => {
            const mesh = e.getComponent(ThreeMesh).value;
            this.camera.position.x = mesh.position.x;
            this.camera.position.y = mesh.position.y + 8;
            this.camera.position.z = mesh.position.z - 8;
            this.control.target.z = mesh.position.z + 8;
        })
    }

}

CameraSystem.queries = {
    to_follow: {
        components: [CameraTarget, ThreeMesh]
    }
}