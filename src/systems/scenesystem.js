import { System } from "ecsy";
import { ThreeMesh, CannonBody } from "../components";

export default class SceneSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
        this.scene = attributes.scene;
    }

    init() {}

    execute() {
        // removed 
        this.queries.entities.removed.forEach(e => {
            // get the mesh
            const mesh = e.getRemovedComponent(ThreeMesh).value;
            this.scene.remove(mesh);
        })

        // added
        this.queries.entities.added.forEach(e => {
            const mesh = e.getComponent(ThreeMesh).value;
            this.scene.add(mesh);
        })

        // syncWithPhysics
        this.queries.syncWithPhysics.results.forEach(e => {
            const mesh = e.getComponent(ThreeMesh).value;
            const body = e.getComponent(CannonBody).value;
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
        })
    }

}

SceneSystem.queries = {
    entities: {
        components: [ThreeMesh],
        listen: {
            added: true,
            removed: true
        }
    },
    syncWithPhysics: {
        components: [ThreeMesh, CannonBody]
    }
}