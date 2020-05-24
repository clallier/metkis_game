import { System } from "ecsy";
import {
    GroupPlayer, GroupEnemy, DistanceWeapon, CannonBody, MeshAnimation, GUI
} from "../components";
import { Vector3 } from "three";

export default class WeaponSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
    }

    init() { }

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

                // if no enemies, returns 
                if (enemies.length < 1) return;

                // permit to compute distances to current entity 
                const p0 = e.getComponent(CannonBody).value.position;

                // sort enemies in order to find the closest
                if (weapon.target == null ||
                    weapon.target.hasComponent(CannonBody) == false ||
                    weapon.time_to_next_target >= weapon.delay_to_next_target) {
                    weapon.time_to_next_target = 0;
                    this.sortByDistance(enemies, p0);
                    // closest enemy position
                    weapon.target = enemies[0];
                }
                const p1 = weapon.target.getComponent(CannonBody).value.position;


                // impulse
                // TODO customise using component: impulse speed, y, relative to distance
                const impulse = p1.vsub(p0);
                // .setLength(shootBullets.impulse_speed);
                // TODO y += shootBullets.impulse_y
                // .setY(shootBullets.impulse_y)

                // set animation + target
                this.world.game_factory.createBullet(p0, impulse);
                const mesh_anim = e.getComponent(MeshAnimation);
                if (mesh_anim) {
                    mesh_anim.current_animation = mesh_anim.attack;
                    mesh_anim.current_animation_duration = 0.5;
                    mesh_anim.time = 0;
                    mesh_anim.target = new Vector3(p1.x, 1, p1.z);
                }
            }

            // update gui test
            const gui = e.getMutableComponent(GUI);
            if(gui == null) return;
            const circularProgress = gui.map.get('kpi');
            if(circularProgress)
                circularProgress.progress = weapon.time_to_next_target / weapon.delay_to_next_target;
        })
    }

    // FEAT : in sight
    sortByDistance(entity_list, p0) {
        let p1 = null, p2 = null, d1 = 0, d2 = 0;
        entity_list.sort((e1, e2) => {
            p1 = e1.getComponent(CannonBody).value.position;
            p2 = e2.getComponent(CannonBody).value.position;
            d1 = p1.distanceTo(p0);
            d2 = p2.distanceTo(p0);
            return d1 > d2 ? 1 : -1;
        });
    }
}

WeaponSystem.queries = {
    enemies: {
        components: [GroupEnemy, CannonBody]
    },
    distance_weapons: {
        components: [DistanceWeapon, GroupPlayer, CannonBody]
    }
}