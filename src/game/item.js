import {
    CanvasTexture, LinearMipmapLinearFilter,
    NearestFilter, SpriteMaterial, Sprite
} from "three";

export default class Item {
    constructor(size, position, spriteSheet) {

        const tile = spriteSheet.getTile(0, 9);

        const texture = new CanvasTexture(tile);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;

        const material = new SpriteMaterial({ map: texture });
        const mesh = new Sprite(material);
        mesh.scale.set(0.8 * size[0], 0.8 * size[1], 1);
        mesh.position.x = position[0];
        mesh.position.y = position[1];
        mesh.position.z = position[2];

        return mesh;
    }
}