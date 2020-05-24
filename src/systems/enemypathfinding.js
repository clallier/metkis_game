import { System } from "ecsy";
import { PathFinding, CannonBody } from "../components";
import CANNON from 'cannon';

export default class EnemyPathFindingSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
        this.map_level = attributes.map_level;
    }

    init() {}

    execute(delta) {
        this.queries.entities.results.forEach(e => {
            const body = e.getComponent(CannonBody).value;
            const pos = body.position;
            const x = Math.round(-pos.x);
            const y = Math.round(-pos.z);
            const d = this.map_level.query_direction(x, y);
            const dir = new CANNON.Vec3(-d[0], 0, -d[1]);
            dir.normalize();
            body.applyImpulse(dir.mult(0.4), pos);
        })
    }

}

EnemyPathFindingSystem.queries = {
    entities: {
        components: [PathFinding, CannonBody]
    }
}