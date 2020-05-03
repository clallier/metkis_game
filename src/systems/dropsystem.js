import { System } from "ecsy";
import { ThreeMesh, CannonBody, Drop, Damageable } from "../components/components";

export default class DropSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
    }

    init() {}

    execute() {
        // removed 
        this.queries.entities.removed.forEach(e => {
            // get the mesh
            // is the entity dead ?
            const loot = e.getRemovedComponent(Drop).value;
            const position = e.getRemovedComponent(ThreeMesh).value.position;
            loot(position)
        })
    }

}

DropSystem.queries = {
    entities: {
        components: [Drop, ThreeMesh],
        listen: {
            removed: true
        }
    }
}