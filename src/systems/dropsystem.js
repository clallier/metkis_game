import { System } from "ecsy";
import { CannonBody, DroppableOnDeath, Controllable, Pickupable, ApplyImpulse, Inventory, DeleteAfter } from "../components";

export default class DropSystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
        this.radius = .8;
        this.effect = 3;
    }

    init() { }

    execute() {
        // dropOnDeath 
        this.queries.dropOnDeath.removed.forEach(e => {
            const loot = e.getRemovedComponent(DroppableOnDeath).item;
            // get the position
            const position = e.getRemovedComponent(CannonBody).value.position;
            loot(position)
        })

        // players
        this.queries.players.results.forEach(player => {
            const p0 = player.getComponent(CannonBody).value.position;

            // pickupables
            this.queries.pickupables.results.forEach(e => {
                const p1 = e.getComponent(CannonBody).value.position;
                const d = p0.vsub(p1);
                const mag = d.length();
                d.normalize();
                if (mag < this.radius * this.effect && mag > this.radius) {
                    e.addComponent(ApplyImpulse, {
                        impulse: d.scale(0.05),
                        point: p1
                    });
                }
                else if (mag < this.radius) {
                    const { money } = e.getComponent(Inventory);
                    const inventory = player.getMutableComponent(Inventory);
                    inventory.money += money;
                    console.log(`player has now ${inventory.money}$`)
                    if (e.hasComponent(DeleteAfter) == false)
                        e.addComponent(DeleteAfter);
                }
            })
        })

    }

}

DropSystem.queries = {
    dropOnDeath: {
        components: [DroppableOnDeath, CannonBody],
        listen: {
            removed: true
        }
    },

    players: {
        components: [Controllable, CannonBody]
    },

    pickupables: {
        components: [Pickupable, CannonBody]
    }
}