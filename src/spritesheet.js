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

    getTile(x, y) {
        const ctx = document.createElement('canvas').getContext('2d');
        // size the canvas to the desired sub-sprite size
        x = x * this.tile_w;
        y = y * this.tile_h;
        ctx.canvas.width = this.tile_w;
        ctx.canvas.height = this.tile_w;
        // clip the sub-sprite from x,y,w,h on the spritesheet image
        ctx.drawImage(this.spritesheet, 
            x, y, this.tile_w, this.tile_h, 
            0, 0, this.tile_w, this.tile_h);
        return ctx.canvas;
    }

    getRandomTile() {
        const x = ~~(Math.random() * this.w) + 2
        const y = ~~(Math.random() * this.h) + 10
        return this.getTile(x, y);
    }
}