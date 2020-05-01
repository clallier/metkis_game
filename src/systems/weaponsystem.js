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
            const mesh = e.getComponent(ThreeMesh).value;
            const shootBullets = e.getMutableComponent(ShootBullets);
            
            // update time
            shootBullets.time += delta;

            // spawn a bullet
            if (shootBullets.time >= shootBullets.delay) {
                shootBullets.time = 0;

                // TODO check + find the closest + clone mandatory ?
                const pos = mesh.position.clone();
                const enemy_mesh = bad_boys[0].getComponent(ThreeMesh).value
                const enemy_pos = enemy_mesh.position.clone();

                // impulse
                const impulse = enemy_pos.sub(pos).setLength(5);
   
                // offset
                const offset = impulse.clone().setLength(0.5);

                const bullet_pos = new Vector3(pos.x + offset.x, 1, pos.z + offset.z);
                this.world.factory.createBullet(bullet_pos, impulse);
            }
        })
    }

}

WeaponSystem.queries = {
    bad_boys: {
        components: [BadBoy]
    },
    good_boy_bullets: {
        components: [ShootBullets, GoodBoy]
    }
}