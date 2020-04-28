export default class EntityArray {

    constructor(world, scene) {
        this.id = 0;
        this.entities = [];
        this.world = world;
        this.scene = scene;
    }

    add(entity) {
        entity.id = this.id;

        if('mesh' in entity) {
            entity.mesh.entity_id = this.id; 
            this.scene.add(entity.mesh);
        }

        if('body' in entity) {
            entity.body.entity_id = this.id; 
            this.world.add(entity.body);
        }

        this.entities.push(entity);
        this.id += 1;
    }

    update(delta) {
        // TODO position componant update
        for (const entity of this.entities) {
            if('mesh' in entity && 'body' in entity) {
                entity.mesh.position.copy(entity.body.position);
                entity.mesh.quaternion.copy(entity.body.quaternion);
            }
        }

        // TODO update animation + time to live + out of world + AI on entities
        for (const entity of this.entities) {
            if('update' in entity) {
                entity.update(delta);
            }
        }

        this.remove();
    }

    remove() {
        // remove entities
        const to_remove = this.entities.filter(e => e.to_remove == true);
        for(const entity of to_remove) {
            this.world.remove(entity.body);
            this.scene.remove(entity.mesh);
        }
        this.entities = this.entities.filter(e => e.to_remove != true);
    }
}