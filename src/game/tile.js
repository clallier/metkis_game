import {
    PlaneGeometry, Texture, MeshBasicMaterial, Mesh,
    LinearMipmapLinearFilter, NearestFilter
} from "three";

export default class Tile {
    constructor(size, position, spriteSheet) {
        const geometry = new PlaneGeometry(
            size[0],
            size[1], 
            1, 1
        );

        const x = ~~(Math.random() * 2) + 4
        const y = 14
        const tile = spriteSheet.getTile(x, y);

        const texture = new Texture(tile);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;

        const material = new MeshBasicMaterial({
            map: texture
        });
        const mesh = new Mesh(geometry, material);
        mesh.position.x = position[0];
        mesh.position.y = position[1] - 0.5;
        mesh.position.z = position[2];
        mesh.rotation.x = -Math.PI / 2;

        return mesh;
    }
}