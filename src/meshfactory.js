import {
    Vector2, CanvasTexture,
    LinearMipmapLinearFilter, NearestFilter,
    BoxGeometry, PlaneGeometry, AxesHelper,
    SpriteMaterial, MeshBasicMaterial,
    Sprite, Mesh, Group, Vector3, CylinderBufferGeometry, MeshToonMaterial
} from 'three';

export default class MeshFactory {

    // TODO rename to createGUIMaterial
    static createGUIMap(infos = new Map(), options = {}) {
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

        // TODO cleanup
        // canvas size
        // TODO compute size
        const width = 250;
        const height = 150;
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.canvas.style.width = width + "px";
        ctx.canvas.style.height = height + "px";

        let x = 3 * lineWidth, y = doubleBorderSize;
        for (let info of infos) {
            // text
            if (info[0] == 'description') {
                ctx.save();
                ctx.beginPath();
                ctx.font = font;
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = strokeStyle;
                ctx.fillStyle = fillStyle;
                ctx.textBaseline = 'top';

                // write text
                const text = info[1];
                ctx.moveTo(x, y);
                ctx.strokeText(text, x, y);
                ctx.fillText(text, x, y);
                ctx.closePath();
                ctx.restore();

                // update position
                y += fontsize + lineWidth;
            }
            // kpi
            else if (info[0] == 'kpi') {
                const radius = 32;
                const center_x = x + radius;
                const center_y = y + radius;
                const start = Math.PI / 2;
                // 1% in radian
                const n = parseFloat(info[1]);
                const end = start + n * Math.PI * 2;
                const bg_end = start + Math.PI * 2;

                ctx.save();
                ctx.moveTo(x, y);
                // background
                ctx.beginPath();
                ctx.lineWidth = doubleBorderSize;
                ctx.strokeStyle = '#ff88ff';
                ctx.arc(center_x, center_y, radius, start, bg_end, false);
                ctx.stroke();
                ctx.closePath();

                // foreground
                ctx.beginPath();
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = '#88ffff';
                ctx.arc(center_x, center_y, radius, start, end, false);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();

                y += 2 * radius + lineWidth;
            }
        }

        // TODO draw line
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.moveTo(lineWidth, 0);
        ctx.lineTo(lineWidth, height);
        // ctx.moveTo(0, 0);
        // ctx.lineTo(width, 0);

        ctx.strokeStyle = '#ff88ff';
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        const texture = new CanvasTexture(ctx.canvas);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;
        return texture;
    }

    static createSelectionMark(percent = 0.0, options = {}) {
        // TODO more options
        const strokeStyle = options.strokeStyle || '#000000';
        const fontsize = options.fontsize || 32;
        const fontface = options.fontface || 'monospace';
        const lineWidth = ~~(fontsize / 4);
        const doubleBorderSize = lineWidth * 2;
        const font = `bold ${fontsize}px ${fontface}`;
        
        // TODO createCanvas
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = font;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;

        // TODO cleanup
        // canvas size
        const radius = 60;
        const width = radius * 2 + doubleBorderSize;
        const height = radius * 2 + doubleBorderSize;
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.canvas.style.width = width + "px";
        ctx.canvas.style.height = height + "px";

        // TODO draw double arc 
        const x = lineWidth;
        const y = lineWidth;
        const center_x = x + radius;
        const center_y = x + radius;
        const start = Math.PI / 2;
        const n = parseFloat(percent);
        const end = start + n * Math.PI * 2;
        const bg_end = start + Math.PI * 2;

        ctx.save();
        // background
        ctx.moveTo(x, y);
        ctx.beginPath();
        ctx.lineWidth = doubleBorderSize;
        ctx.strokeStyle = '#ff88ff';
        ctx.arc(center_x, center_y, radius, start, bg_end, false);
        ctx.stroke();
        ctx.closePath();

        // foreground
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#88ffff';
        ctx.arc(center_x, center_y, radius, start, end, false);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        const texture = new CanvasTexture(ctx.canvas);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;
        return texture;
    }

    // TODO rename
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

    static createCylinder(radiusTop, radiusBottom, height, radialSegments,
        position, color = 0x00ffff) {
        var geometry = new CylinderBufferGeometry(
            radiusTop,
            radiusBottom,
            height,
            radialSegments);

        const material = new MeshToonMaterial({
            color: color,
            shininess: 0.2,
            flatShading: true
        });

        const mesh = new Mesh(geometry, material);
        mesh.position.x = position[0];
        mesh.position.y = position[1];
        mesh.position.z = position[2];
        return mesh;
    }

    static createGUIMesh(position = new Vector3(), map = null,
        isWall = false, color = null) {
        const width = map != null ? map.image.width : 100;
        const height = map != null ? map.image.height : 100;
        const geometry = new PlaneGeometry(0.01 * width, 0.01 * height, 1, 1);

        const material = new MeshBasicMaterial({
            color: color,
            map: map,
            transparent: true
        });

        const mesh = new Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.rotation.z = -Math.PI;

        if (isWall) mesh.rotation.x = -Math.PI;
        else mesh.rotation.x = -Math.PI / 2;
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