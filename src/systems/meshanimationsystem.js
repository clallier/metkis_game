import { System } from "ecsy";
import { MeshAnimation, ThreeMesh } from "../components/components";

export default class MeshAnimationSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
    }

    init() {
        // TODO 
        this.time = 0;
    }

    execute(delta) {
        // update time
        const t = this.time;
        const PI = Math.PI;
        const TAU = 2 * PI;
        const cos = Math.cos;

        this.time += delta;
        this.time = this.time % TAU;

        this.queries.animations.results.forEach(e => {
            const mesh = e.getComponent(ThreeMesh).value;
            let animation = e.getMutableComponent(MeshAnimation);
            
            const head = mesh.getObjectByName('head');
            const gun = head.getObjectByName('gun');
            // gun.rotation.y = t * 10;
            // head.rotation.y = Math.cos(t);
        })
    }
}

MeshAnimationSystem.queries = {
    animations: {
        components: [MeshAnimation, ThreeMesh]
    }
}