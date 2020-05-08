import { System } from "ecsy";
import { GUI, ThreeMesh } from "../components/components";
import MeshFactory from "../meshfactory";
import { Vector3 } from "three";

export default class GUISystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
    }

    init() { }

    execute() {

        // entities 
        this.queries.entities.added.forEach(e => {
            // get th GUI infos
            const infos = e.getComponent(GUI).infos;
            // get the mesh
            const mesh = e.getComponent(ThreeMesh).value;

            // add texture to mesh
            const sprite = MeshFactory.createGUIMesh(
                new Vector3(0, 1, 0),
                MeshFactory.createGUIMap(infos),
                true);
            sprite.name = 'gui';
            mesh.add(sprite);

            // selection
            const sel = MeshFactory.createGUIMesh(
                new Vector3(0, -0.4, 0),
                MeshFactory.createSelectionMark(new Map([['kpi', 1]]))
                );
            sel.name = 'selection';
            mesh.add(sel);
        })

        // entities 
        this.queries.entities.changed.forEach(e => {
            // get th GUI infos
            const infos = e.getComponent(GUI).infos;
            // get the mesh
            const mesh = e.getComponent(ThreeMesh).value;
            // update texture if needed
            const sprite = mesh.getObjectByName('gui');
            if (sprite != null) {
                sprite.material.map = MeshFactory.createGUIMap(infos);
            }
        })
    }

}

GUISystem.queries = {
    entities: {
        components: [GUI, ThreeMesh],
        listen: {
            added: [ThreeMesh],
            changed: [GUI]
        }
    }
}