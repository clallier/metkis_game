import { System } from "ecsy";
import {
    CannonBody, Controllable, ApplyImpulse, Collider, Damageable, DeleteAfter
} from "../components";
import CANNON from 'cannon';

// raycast for fast objects (for CCD - Continuous Collision Detection)
// from https://github.com/schteppe/cannon.js/issues/202
// const raycaster = new THREE.Raycaster();

// // Must predict next position and check if the ray trajectory if it intersects anything!
// function limitSphere(ball, objs){
//     var arr;
//     raycaster.set(ball.position.clone(), ball.velocity.clone().unit());
//     raycaster.far = ball.velocity.length();
//     arr = raycaster.intersectObjects(objs);

//     if(arr.length){
//         ball.position.copy(arr[0].point);
//     }
// }

export default class PhysicSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
        this.cannon_world = attributes.cannon_world;
        this.controller = attributes.controller;
        this.precision = 3;
    }

    init() { }

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
            body.entity_data = e;
            this.cannon_world.add(body);
        })

        this.queries.entities.results.forEach(e => {
            const body = e.getComponent(CannonBody).value;
            if (body.position.y < -40) {
                // console.log("Outsite of the world", e.id)
                if (e.hasComponent(DeleteAfter) == false)
                    e.addComponent(DeleteAfter)
            }
        })

        // controllables
        this.queries.controllables.results.forEach(e => {
            const body = e.getComponent(CannonBody).value;
            const dir = this.controller.state.dir;
            const power = 0.4;
            let force = new CANNON.Vec3(dir.x * power, 0, dir.y * power)
                .scale(-1);
            body.applyImpulse(force, body.position);
        })


        // impulses
        this.queries.impulses.added.forEach(e => {
            const body = e.getComponent(CannonBody).value;
            const force = e.getComponent(ApplyImpulse);
            body.applyImpulse(force.impulse, force.point);
            e.removeComponent(ApplyImpulse);
        })

        // colliders
        this.queries.colliders.added.forEach(e => {
            const body = e.getComponent(CannonBody).value;
            body.addEventListener('collide', (e) => this.collide(e));
        })

        // sim
        for (let i = 0; i < this.precision; i++) {
            this.cannon_world.step(delta / this.precision);
        }
    }

    collide(e) {
        // ignore tiny collisions
        const impact = Math.abs(e.contact.getImpactVelocityAlongNormal())
        if (impact < 5.0) return
        const bodies = [e.contact.bi, e.contact.bj]

        // damages
        bodies.forEach((body) => {
            const entity = body.entity_data;
            if (entity == null) return;
            const damageable = entity.getComponent(Damageable);
            if (damageable == null) return;

            damageable.hp -= 1;
            if (damageable.hp <= 0 && entity.hasComponent(DeleteAfter) == false)
                entity.addComponent(DeleteAfter);
        })
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
    },
    colliders: {
        components: [Collider, CannonBody],
        listen: {
            added: true
        }
    }
}