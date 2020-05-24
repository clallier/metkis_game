import {
    Vector2, Texture, LinearMipmapLinearFilter, NearestFilter,
    BoxGeometry, PlaneGeometry, AxesHelper, SpriteMaterial, MeshBasicMaterial,
    Sprite, Mesh, Group, Vector3, CylinderBufferGeometry, MeshToonMaterial
} from 'three';
import { GUIStylesOptions, GUITexture, GUIText, GUICircularProgress, GUIBorders } from './canvastexturefactory';

export default class MeshFactory {

    // TODO rename to createGUIMaterial
    static createGUITexture(infos = new Map(), options = new GUIStylesOptions()) {
        options.bgBarStrokeStyle = "#ff88ff";
        options.fgBarStrokeStyle = "#88ffff";
        const elements = Array.from(infos.values());
        elements.push(new GUIBorders(true, true, true, true));
        const canvas = new GUITexture(elements, options);
        const texture = new Texture(canvas);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;
        return texture;
    }

    static createSelectionTexture(progress = 0.0, options = new GUIStylesOptions()) {
        options.bgBarStrokeStyle = "#ff88ff";
        options.fgBarStrokeStyle = "#88ffff";
        const canvas = new GUITexture(new GUICircularProgress(progress, 60), options);
        const texture = new Texture(canvas);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;
        return texture;
    }

    static createTextSprite(position = new Vector3(), text = 'hi', options = new GUIStylesOptions()) {
        const canvas = new GUITexture(new GUIText(text), options);
        const texture = new Texture(canvas);
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;

        const material = new SpriteMaterial({ map: texture });
        const sprite = new Sprite(material);
        sprite.scale.set(0.01 * canvas.width, 0.01 * canvas.height, 1);
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

    static createGUIMesh(position = new Vector3(), texture = null,
        isWall = false, color = null) {
        const width = texture != null ? texture.image.width : 100;
        const height = texture != null ? texture.image.height : 100;
        const geometry = new PlaneGeometry(0.01 * width, 0.01 * height, 1, 1);

        const material = new MeshBasicMaterial({
            color: color,
            map: texture,
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

        const tx = MeshFactory.createTextSprite(new Vector3(1, 0, 0), 'x');
        group.add(tx);

        const ty = MeshFactory.createTextSprite(new Vector3(0, 1, 0), 'y');
        group.add(ty);

        const tz = MeshFactory.createTextSprite(new Vector3(0, 0, 1), 'z');
        group.add(tz);

        group.position.copy(position);

        return group;
    }
}