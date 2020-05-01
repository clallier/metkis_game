import { System } from "ecsy";
import { CannonBody, Controllable, ApplyImpulse } from "../components/components";
import CANNON from 'cannon';

export default class PhysicSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
        this.cannon_world = attributes.cannon_world;
        this.controller = attributes.controller;
    }

    init() { }

    execute(delta) {
        const entities = this.queries.entities;
        // removed 
        entities.removed.forEach(e => {
            // get the body
            const body = e.getRemovedComponent(CannonBody).value;
            this.cannon_world.remove(body);
        })

        // added
        entities.added.forEach(e => {
            const body = e.getComponent(CannonBody).value;
            this.cannon_world.add(body);
        })

        entities.results.forEach(e => {
            const body = e.getComponent(CannonBody).value;
            if (body.position.y < -20) {
                console.log('goodbye!')
                e.remove()
            }
        })

        // controllables
        this.queries.controllables.results.forEach(e => {
            const body = e.getComponent(CannonBody).value;
            const dir = this.controller.state.dir;
            let force = new CANNON.Vec3(dir.x, 0, dir.y)
                .scale(-0.5);
            body.applyImpulse(force, body.position);
        })

        
        // impulses
        this.queries.impulses.added.forEach(e => {
            const body = e.getComponent(CannonBody).value;
            const force = e.getComponent(ApplyImpulse);
            body.applyImpulse(force.impulse, force.point);
        })

        // sim
        // TODO loop
        this.cannon_world.step(delta / 4);
        this.cannon_world.step(delta / 2);
    }

}

PhysicSystem.queries = {
    entities: {
        components: [CannonBody],
        listen: {
            added: true,
            removed: true
        }
    },
    controllables: {
        components: [Controllable, CannonBody]
    },
    impulses: {
        components: [ApplyImpulse, CannonBody],
        listen: {
            added: true
        }
    }
}