import { System } from "ecsy";
import { GUI, ThreeMesh, Selectionable, Controllable, CannonBody } from "../components";
import MeshFactory from "../meshfactory";
import { Vector3 } from "three";

export default class GUISystem extends System {
    constructor(world, attributes) {
        super(world, attributes);
        this.selectionRadius = 2;
    }

    init() { }

    execute(delta) {
        // selectionable added
        this.queries.selectionable.added.forEach(e => {
            // get the mesh
            const mesh = e.getComponent(ThreeMesh).value;

            // add texture to mesh
            this.createSelection(mesh);
        })

        // players
        this.queries.players.results.forEach(player => {
            const p0 = player.getComponent(CannonBody).value.position;

            // selectionable
            this.queries.selectionable.results.forEach(e => {
                // selectionable position
                const p1 = e.getComponent(CannonBody).value.position;
                if (Math.abs(p1.x - p0.x) > this.selectionRadius + 1) return;
                if (Math.abs(p1.z - p0.z) > this.selectionRadius + 1) return;

                // get the mesh, selection, etc
                const mesh = e.getComponent(ThreeMesh).value;
                const sel = e.getMutableComponent(Selectionable);
                const gui = e.getMutableComponent(GUI);

                const d = p0.vsub(p1);
                const mag = d.length();

                if (mag > this.selectionRadius) {
                    sel.timer = 0;
                    sel.active = false;
                    this.updateSelection(mesh, 0);
                    if (gui && gui.active == true) 
                        gui.active = false;
                }

                // update selection mark
                else {
                    // get the GUI infos
                    sel.timer += delta;
                    sel.timer = Math.min(1, sel.timer);
                    this.updateSelection(mesh, sel.timer);
                }

                // selection + activation
                if (sel.timer >= 1 && sel.active == false) {
                    sel.active = true;
                    // gui activation
                    if (gui && gui.active == false) 
                        gui.active = true;
                }
            })
        })

        // gui added
        this.queries.gui.added.forEach(e => {
            // get the GUI infos
            const gui = e.getComponent(GUI);
            // get the mesh
            const mesh = e.getComponent(ThreeMesh).value;

            // add texture to mesh
            this.createGUI(gui, mesh);
        })

        // gui changed 
        this.queries.gui.changed.forEach(e => {
            const gui = e.getComponent(GUI);
            // get the mesh
            const mesh = e.getComponent(ThreeMesh).value;
            // update texture if needed
            this.updateGUI(gui, mesh);
        })
    }


    updateGUI(gui, mesh) {
        // get th GUI infos
        const { map, active } = gui;

        const sprite = mesh.getObjectByName('gui');
        if (sprite != null) {
            if (active) {
                sprite.visible = true;
                sprite.material.map = MeshFactory.createGUITexture(map);
            } else {
                sprite.visible = false;
            }
        }
    }

    createGUI(gui, mesh) {
        const { map } = gui;

        const sprite = MeshFactory.createGUIMesh(
            new Vector3(0, 1, 0),
            MeshFactory.createGUITexture(map),
            true);
        sprite.name = 'gui';
        sprite.visible = false;
        mesh.add(sprite);
    }

    updateSelection(mesh, timer) {
        const sprite = mesh.getObjectByName('selection');
        if (sprite != null) {
            if (timer > 0) {
                sprite.visible = true;
                sprite.material.map = MeshFactory.createSelectionTexture(timer);
            } else {
                sprite.visible = false;
            }
        }
    }

    createSelection(mesh) {
        const sel = MeshFactory.createGUIMesh(
            new Vector3(0, -0.4, 0),
            MeshFactory.createSelectionTexture(.0)
        );
        sel.name = 'selection';
        sel.visible = false;
        mesh.add(sel);
    }
}

GUISystem.queries = {
    players: {
        components: [Controllable, CannonBody]
    },
    selectionable: {
        components: [Selectionable, CannonBody, ThreeMesh],
        listen: {
            added: [CannonBody]
        }
    },
    gui: {
        components: [GUI, ThreeMesh],
        listen: {
            added: [ThreeMesh],
            changed: [GUI]
        }
    }
}