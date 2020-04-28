import { System } from "ecsy";
import { CannonBody } from "../components/components";

export default class PhysicSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
        this.cannon_world = attributes.cannon_world;
    }

    init() {}

    execute(delta) {
        // removed 
        this.queries.entities.removed.forEach(e => {
            // get the body
            const body = e.getRemovedComponent(CannonBody).value;
            this.cannon_world.remove(body);
        })

        // added
        this.queries.entities.added.forEach(e => {
            const body = e.getComponent(CannonBody).value;
            this.cannon_world.add(body);
        })

        // sim
        this.cannon_world.step(delta);
    }

}

PhysicSystem.queries = {
    entities: {
        components: [CannonBody],
        listen: {
            added: true,
            removed: true
        }

    }
}