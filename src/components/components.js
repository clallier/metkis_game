import { Component, TagComponent } from "ecsy";

export class CameraTarget extends TagComponent {}
export class Controllable extends TagComponent {}

export class DeleteAfter extends Component {
    constructor() {
        super();
        // timer
        this.seconds = 0;
    }
    
    reset() {
        this.seconds = 0;
    }
}

export class CannonBody extends Component {
    constructor() {
        super();
        // body 
        this.value = null;
    }

    reset() {
        this.value = null;
    }
}

export class ThreeMesh extends Component {
    constructor() {
        super();
        // mesh 
        this.value = null;
    }

    reset() {
        this.value = null;
    }
}

export class SpriteAnimation extends Component {
    constructor() {
        super();
        this.reset();
    }
    
    reset() {
        this.time = 0;
        this.current_animation = null;
        this.frame = 0;
        this.move_left = [];
        this.move_right = [];
        this.default = [];
    }
}