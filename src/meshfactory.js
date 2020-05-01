import {
    Vector2, CanvasTexture,
    LinearMipmapLinearFilter, NearestFilter,
    BoxGeometry, PlaneGeometry, AxesHelper,
    SpriteMaterial, MeshBasicMaterial,
    Sprite, Mesh, Group, Vector3
} from 'three';

export default class MeshFactory {

    static createText(position = new Vector3(), text = 'hi', options = {}) {
        // https://threejsfundamentals.org/threejs/lessons/threejs-canvas-textures.html
        // TODO more options
        const fillStyle = options.fillStyle || '#ffffff';
        const strokeStyle = options.strokeStyle || '#000000';
        const fontsize = options.fontsize || 32;
        const fontface = options.fontface || 'monospace';
        const lineWidth = ~~(fontsize / 4);
        const doubleBorderSize = lineWidth * 2;
        const font = `bold ${fontsize}px ${fontface}`;
        // ctx 
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = font;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle = fillStyle;

        // size
        const width = ~~ctx.measureText(text).width + doubleBorderSize + 1;
        const height = fontsize + doubleBorderSize;
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.canvas.style.width = width + "px";
        ctx.canvas.style.height = height + "px";

        // need to set font again after resizing canvas
        ctx.font = font;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle = fillStyle;
        ctx.textBaseline = 'top';

        // write text
        ctx.strokeText(text, lineWidth, lineWidth);
        ctx.fillText(text, lineWidth, lineWidth);

        const texture = new CanvasTexture(ctx.canvas);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;

        const material = new SpriteMaterial({ map: texture });
        const sprite = new Sprite(material);
        sprite.scale.set(0.01 * width, 0.01 * height, 1);
        sprite.position.copy(position);
        return sprite;
    }

    static createCube(size, position, color = 0x00ffff) {
        const geometry = new BoxGeometry(
            size[0],
            size[1],
            size[2]
        );

        const material = new MeshBasicMaterial({
            color: color
        });

        const mesh = new Mesh(geometry, material);
        mesh.position.x = position[0];
        mesh.position.y = position[1];
        mesh.position.z = position[2];
        return mesh;
    }

    static createTile(size = new Vector2(1, 1), color = 0xff00ff) {
        const geometry = new PlaneGeometry(
            size.x,
            size.y,
            1, 1);

        const material = new MeshBasicMaterial({
            color: color
        });

        const mesh = new Mesh(geometry, material);
        mesh.position.y = 0.5;
        mesh.rotation.x = -Math.PI / 2;

        return mesh;
    }

    static createAxes(position = new Vector3()) {
        const group = new Group();
        const axes = new AxesHelper(1);
        group.add(axes);

        const tx = MeshFactory.createText(new Vector3(1, 0, 0), 'x');
        group.add(tx);

        const ty = MeshFactory.createText(new Vector3(0, 1, 0), 'y');
        group.add(ty);
        
        const tz = MeshFactory.createText(new Vector3(0, 0, 1), 'z');
        group.add(tz);
        
        group.position.copy(position);

        return group;
    }

}