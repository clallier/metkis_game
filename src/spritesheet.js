export default class SpriteSheet {
    constructor(src, w, h, tile_w, tile_h) {
        this.w = w; // in tiles
        this.h = h; // in tiles
        this.tile_w = tile_w; // in pixels
        this.tile_h = tile_h; // in pixels
        this.spritesheet = new Image();
        this.spritesheet.src = src;
    }

    async load() {
        return new Promise(
            resolve => this.spritesheet.onload = () => {
                resolve()
            }
        )
    }

    getTile(x, y, options = {}) {
        const width = options.width != null? options.width: this.tile_w;
        const height = options.height != null? options.height: this.tile_w;
        const flip_x = options.flip_x != null? options.flip_x: 1;
        const flip_y = options.flip_y != null? options.flip_y: 1;
        // create canvas
        const ctx = document.createElement('canvas').getContext('2d');
        // size the canvas to the desired sub-sprite size
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        // scale ctx
        ctx.save();
        ctx.translate(0, 0);
        ctx.scale(flip_x, flip_y);
        // clip the sub-sprite from x,y,w,h on the spritesheet image
        x = x * this.tile_w; // in tiles
        y = y * this.tile_h; // in tiles
        const dest_x = flip_x == -1? -width: 0
        const dest_y = flip_y == -1? -height: 0
        ctx.drawImage(this.spritesheet,
            x, y, width, height,            // source
            dest_x, dest_y, width, height); // dest
        ctx.restore();
        return ctx.canvas;
    }

    getRandomTile() {
        const x = ~~(Math.random() * this.w) + 2
        const y = ~~(Math.random() * this.h) + 10
        return this.getTile(x, y);
    }
}