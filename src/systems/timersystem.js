import { System } from "ecsy";
import { DeleteAfter } from "../components";

export default class TimerSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
    }

    init() {}

    execute(delta) {
        // delete after xxx ms
        this.queries.deleteAfter.results.forEach(e => {
            const time_left = (e.getMutableComponent(DeleteAfter).seconds -= delta);
            if(time_left <= 0) 
                e.remove();
        })
    }

}

TimerSystem.queries = {
    deleteAfter: {
        components: [DeleteAfter]
    }
}