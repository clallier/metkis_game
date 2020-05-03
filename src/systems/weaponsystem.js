import { System } from "ecsy";
import {
    GroupPlayer, GroupEnemy, DistanceWeapon, ThreeMesh
} from "../components/components";
import { Vector3 } from "three";

export default class WeaponSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
    }

    init() {}

    execute(delta) {
        // enemies
        const enemies = this.queries.enemies.results;

        // distance weapons
        this.queries.distance_weapons.results.forEach(e => {
            const weapon = e.getMutableComponent(DistanceWeapon);
            
            // update time
            weapon.time += delta;
            weapon.time_to_next_target += delta;

            // it's time to spawn a bullet
            if (weapon.time >= weapon.delay) {
                weapon.time = 0;

                // if no bad boys, returns 
                if(enemies.length < 1) return;

                // permit to compute distances to current entity 
                const p0 = e.getComponent(ThreeMesh).value.position.clone();
                
                // sort bad boys in order to find the closest
                if(weapon.target == null || 
                    weapon.time_to_next_target >= weapon.delay_to_next_target)
                    weapon.time_to_next_target = 0;
                    this.sortByDistance(enemies, p0);

                // closest enemy position
                weapon.target = enemies[0];
                const p1 = weapon.target.getComponent(ThreeMesh).value.position.clone();
        

                // impulse
                // TODO customise using component: impulse relative to distance
                const impulse = new Vector3().subVectors(p1, p0);
                    // .setLength(shootBullets.impulse_speed);
                    // TODO y += shootBullets.impulse_y
                    // .setY(shootBullets.impulse_y)
   
                this.world.game_factory.createBullet(p0, impulse);

                const mesh = e.getComponent(ThreeMesh).value;
                // TODO applyAngle
                const head = mesh.getObjectByName('head');
                head.lookAt(new Vector3(p1.x, 1, p1.z));
            }
        })
    }


    // TODO : in sight
    sortByDistance(entity_list, p0) {
        let p1 = null, p2 = null, d1 = 0, d2 = 0;
        entity_list.sort((e1, e2) => {
            p1 = e1.getComponent(ThreeMesh).value.position;
            p2 = e2.getComponent(ThreeMesh).value.position;
            d1 = p1.distanceTo(p0);
            d2 = p2.distanceTo(p0);
            return d1 > d2 ? 1 : -1;
        });
    }
}

WeaponSystem.queries = {
    enemies: {
        components: [GroupEnemy, ThreeMesh]
    },
    distance_weapons: {
        components: [DistanceWeapon, GroupPlayer, ThreeMesh]
    }
}