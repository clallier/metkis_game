export class GUIStylesOptions {
    constructor(options = {}) {
        this.fillStyle = options.fillStyle || '#ffffff';
        this.strokeStyle = options.strokeStyle || '#000000';
        // text styles
        this.textFillStyle = options.textFillStyle || this.fillStyle;
        this.textStrokeStyle = options.textStrokeStyle || this.strokeStyle;
        // line styles
        this.lineStrokeStyle = options.lineStrokeStyle || this.strokeStyle;
        // progress bars (foreground and background)
        this.fgBarStrokeStyle = options.fgBarStrokeStyle || '#ffffff';
        this.bgBarStrokeStyle = options.bgBarStrokeStyle || this.strokeStyle;

        this.fontsize = options.fontsize || 32;
        this.fontface = options.fontface || 'monospace';
        this.lineWidth = ~~(this.fontsize / 4);
        this.doubleBorderSize = this.lineWidth * 2;
        this.font = `bold ${this.fontsize}px ${this.fontface}`;
    }
}

export class GUIText {
    constructor(text) {
        this.text = text;
    }
}

export class GUICircularProgress {
    constructor(progress, radius = 32) {
        this.progress = progress;
        this.radius = radius;
    }
}

export class GUIBorders {
    constructor(left=false, top=false, right=false, bottom=false) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
}

// https://threejsfundamentals.org/threejs/lessons/threejs-canvas-textures.html
export class GUITexture {
    constructor(
        elements = [],
        styles = new GUIStylesOptions()) {
            elements = [].concat(elements);
            this.ctx = document.createElement('canvas').getContext('2d');
            this.width = this.height = 0;
            this.styles = styles;
            this.applyStyles();
            this.computeSize(elements);
            this.applyStyles();
            let x = this.styles.lineWidth;
            let y = this.styles.lineWidth;
            for (let e of elements) {
                if (e instanceof GUIText) { 
                    this.drawText(e.text, x, y);
                    y += this.styles.fontsize;
                }
                else if (e instanceof GUICircularProgress) {
                    this.drawCircularProgressBar(e.radius, e.progress, x, y);
                    y += 2 * e.radius;
                }
                else if (e instanceof GUIBorders) {
                    this.drawBorders(e.left, e.top, e.right, e.bottom, 0, 0);
                }
                // blank separator
                y += this.styles.lineWidth;
            }
            return this.ctx.canvas;
    }

    applyStyles() {
        this.ctx.font = this.styles.font;
        this.ctx.lineWidth = this.styles.lineWidth;
        this.ctx.strokeStyle = this.styles.strokeStyle;
        this.ctx.fillStyle = this.styles.fillStyle;
        this.ctx.textBaseline = 'top';
    }

    computeSize(elements) {
        for (let e of elements) {
            if (e instanceof GUIText) { 
                const width = Math.ceil(this.ctx.measureText(e.text).width);
                this.width = Math.max(this.width, width);
                this.height += this.styles.fontsize;
            }
            else if (e instanceof GUICircularProgress) {
                this.width = Math.max(this.width, 2 * e.radius);
                this.height += 2 * e.radius;
            }
            
            // space separator
            this.height += this.styles.lineWidth; 
        }
        // add borders sizes
        this.width += this.styles.doubleBorderSize;
        // resize
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
        this.ctx.canvas.style.width = this.width + "px";
        this.ctx.canvas.style.height = this.height + "px";
    }

    drawText(text, x, y) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.styles.textStrokeStyle;
        this.ctx.fillStyle = this.styles.textFillStyle;
        this.ctx.moveTo(x, y);
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
        this.ctx.closePath();
        this.ctx.restore();
    }

    drawLine(x0, y0, x1, y1) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.styles.lineStrokeStyle;
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    drawCircularProgressBar(radius, progress, x, y) {
        progress = parseFloat(progress);
        
        // center point
        const cx = x + radius;
        const cy = y + radius;
        
        // angles
        const start = Math.PI / 2;
        const end = start + progress * Math.PI * 2;
        const bgEnd = start + Math.PI * 2;

        // adapt radius to external border of the ring
        radius -= this.styles.lineWidth;
        
        this.ctx.save();
        this.ctx.moveTo(x, y);
        // background
        this.ctx.beginPath();
        this.ctx.lineWidth = this.styles.doubleBorderSize;
        this.ctx.strokeStyle = this.styles.bgBarStrokeStyle;
        this.ctx.arc(cx, cy, radius, start, bgEnd, false);
        this.ctx.stroke();
        this.ctx.closePath();

        // foreground
        this.ctx.beginPath();
        this.ctx.lineWidth = this.styles.lineWidth;
        this.ctx.strokeStyle = this.styles.fgBarStrokeStyle;
        this.ctx.arc(cx, cy, radius, start, end, false);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    drawBorders(left, top, right, bottom) {
        const w = this.width;
        const h = this.height; 
        const r = 4
        if(left)    this.drawLine(0, r, 0, h-r);
        if(top)     this.drawLine(r, 0, w-r, 0);
        if(right)   this.drawLine(w, r, w, h-r);
        if(bottom)  this.drawLine(r, h, w-r, h);   
    }
}