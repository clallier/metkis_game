import MeshFactory from "../meshfactory";
import { Vector3, Group } from "three";

export default class Turret {
    constructor(position = new Vector3()) {
        // gun
        const gun = MeshFactory.createCylinder(.2, .2, .8, 4, 
            [0, .3, 0], 0xffffff);
        gun.name = 'gun';
        gun.rotation.x = Math.PI / 2;
        
        const marker = MeshFactory.createCylinder(.3, .3, .2, 4, 
            [0, -.2, 0], 0x88ffff);
        gun.add(marker);

        const left_arm = MeshFactory.createCylinder(.1, .2, .4, 4, 
            [0.2, .2, 0], 0xff8888);
        gun.add(left_arm);
       
        const right_arm = MeshFactory.createCylinder(.1, .2, .4, 4, 
            [-0.2, .2, 0], 0xff8888);
        gun.add(right_arm);

        this.mesh = new Group();
        // base
        const base = MeshFactory.createCylinder(.4, .4, .2, 8, 
            [0, -.4, 0], 0x88ffff)        
        this.mesh.add(base);

        const foot = MeshFactory.createCylinder(.2, .3, .6, 8, 
            [0, 0, 0], 0xffffff)        
        this.mesh.add(foot);

        // head
        const head = new Group(); 
        head.name = 'head';
        head.add(gun);
        this.mesh.add(head);

        this.mesh.position.copy(position);
    }

    idleAnimation(time) {
        const head = this.mesh.getObjectByName('head');
        const gun = head.getObjectByName('gun');
        gun.rotation.y = 0;
        head.rotation.y = Math.cos(time);
    }

    attackAnimation(time, target) {
        const head = this.mesh.getObjectByName('head');
        const gun = head.getObjectByName('gun');
        gun.rotation.y = time * 10;
        head.lookAt(target);
    }
}