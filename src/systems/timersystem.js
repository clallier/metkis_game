import { System } from "ecsy";
import { DeleteAfter } from "../components/components";

// TODO add et remove de la scene
export default class TimerSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
    }

    init() {}

    execute(delta) {
        // delete after n.ms
        this.queries.deleteAfter.results.forEach(e => {
            const time_left = (e.getMutableComponent(DeleteAfter).value -= delta);
            if(time_left <= 0) 
                e.remove();
        })
    }

}

TimerSystem.queries = {
    // entities: {
    //     components: [Timer],
    // },
    deleteAfter: {
        components: [DeleteAfter]
    }
}