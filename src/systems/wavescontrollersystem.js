import { System } from "ecsy";
import {
    SpawnEnemies, ThreeMesh, GroupEnemy
} from "../components/components";

export default class WavesControllerSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
        this.enable_spawn = true;
    }

    init() {
    }

    execute(delta) {
        const n_enemies = this.queries.enemies.results.length;
        if (n_enemies > 50) this.enable_spawn = false;
        else if (n_enemies == 0) this.enable_spawn = true;

        // spawn enemies
        if (this.enable_spawn) {
            this.queries.spawners.results.forEach(e => {

                const c = e.getMutableComponent(SpawnEnemies);

                // update time
                c.time += delta;
                c.total_time += delta;

                // cooldown
                if(c.emitting 
                    && c.total_time >= c.duration) {
                    c.total_time = 0;
                    c.emitting = false;
                } else if(c.emitting == false 
                    && c.total_time >= c.cooldown) {
                    c.total_time = 0;
                    c.emitting = true;
                } 

                // it's emitting and time to spawn a bullet
                if (c.emitting && c.time >= c.delay) {
                    c.time = 0;
                    const position = e.getComponent(ThreeMesh).value.position;
                    position.z -= 0.8;
                    position.x += Math.random() * .4 - .2;
                    this.world.game_factory.createEnemy(position);
                }
            })
        }
    }
}

WavesControllerSystem.queries = {
    spawners: {
        components: [SpawnEnemies, ThreeMesh]
    },
    enemies: {
        components: [GroupEnemy, ThreeMesh]
    }
}