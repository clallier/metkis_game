import {
    BoxGeometry, Texture, MeshBasicMaterial, Mesh,
    LinearMipmapLinearFilter, NearestFilter, MeshPhongMaterial
} from "three";

export default class Block {
    constructor(size, position, spriteSheet) {
        const geometry = new BoxGeometry(
            size[0],
            size[1],
            size[2]
        );

        const x = ~~(Math.random() * 6) + 2
        const y = ~~(Math.random() * 2) + 10
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
        mesh.position.y = position[1];
        mesh.position.z = position[2];
        return mesh;
    }
}