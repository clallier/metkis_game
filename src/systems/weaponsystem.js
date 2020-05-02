import { System } from "ecsy";
import {
    GoodBoy, BadBoy, ShootBullets, ThreeMesh
} from "../components/components";
import { Vector3 } from "three";

export default class WeaponSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
    }

    init() { }

    execute(delta) {
        // bad_boys
        const bad_boys = this.queries.bad_boys.results;

        // good boy bullets
        this.queries.good_boy_bullets.results.forEach(e => {
            const shootBullets = e.getMutableComponent(ShootBullets);
            
            // update time
            shootBullets.time += delta;

            // it's time to spawn a bullet
            if (shootBullets.time >= shootBullets.delay) {
                shootBullets.time = 0;

                // if no bad boys, returns 
                if(bad_boys.length < 1) return;

                // permit to compute distances to current entity 
                const p0 = e.getComponent(ThreeMesh).value.position.clone();
                
                // sort bad boys in order to find the closest
                this.sortByDistance(bad_boys, p0);

                // closest enemy position
                const p1 = bad_boys[0].getComponent(ThreeMesh).value.position.clone();

                // impulse
                // TODO customise using component: impulse relative to distance
                const impulse = p1.sub(p0)
                    .setY(shootBullets.impulse_y)
                    .setLength(shootBullets.impulse_speed)
   
                // offset
                const offset = impulse.clone().setLength(0.5);

                const bullet_pos = new Vector3(p0.x + offset.x, 1, p0.z + offset.z);
                this.world.game_factory.createBullet(bullet_pos, impulse);
            }
        })
    }


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
    bad_boys: {
        components: [BadBoy, ThreeMesh]
    },
    good_boy_bullets: {
        components: [ShootBullets, GoodBoy, ThreeMesh]
    }
}