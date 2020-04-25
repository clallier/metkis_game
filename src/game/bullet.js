import { OctahedronGeometry, Texture, MeshToonMaterial, Mesh, LinearMipmapLinearFilter, NearestFilter } from "three";
import CANNON from 'cannon'

export default class Bullet {
    constructor(base_radius, position, spriteSheet) {
        this.time = 0
        const geometry = new OctahedronGeometry(0.2 * base_radius, 1);
        const tile = spriteSheet.getTile(0, 11);

        const texture = new Texture(tile);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;

        const material = new MeshToonMaterial({
            map: texture
        });
        const mesh = new Mesh(geometry, material);
        mesh.position.set(position[0], position[1], position[2]);

        const shape = new CANNON.Sphere(0.1 * base_radius);

        const body = new CANNON.Body({
            mass: 0.1,
            position: new CANNON.Vec3(position[0], position[1], position[2]),
            fixedRotation: true
        })
        body.addShape(shape);

        this.body = body;
        this.mesh = mesh;
    }

}