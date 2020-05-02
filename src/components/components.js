import { Component, TagComponent } from "ecsy";

export class CameraTarget extends TagComponent { }
export class Controllable extends TagComponent { }

export class BadBoy extends TagComponent { }
export class GoodBoy extends TagComponent { }
export class Collider extends TagComponent { }
export class Bullet extends TagComponent { }

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

// TODO weapon component 
export class ShootBullets extends Component {
    constructor() {
        super();
        this.reset();
    }

    reset() {
        // in s
        this.time = 0
        this.delay = 0.1;
        this.impulse_speed = 5;
        this.impulse_y = 0; 
    }
}

export class ApplyImpulse extends Component {
    constructor() {
        super();
        this.reset();
    }

    reset() {
        this.impulse = null; 
        this.point = null;
    }
}

export class Damageable extends Component {
    constructor() {
        super();
        this.reset();
    }

    reset() {
        this.hp = 5;
    }
 }

 export class SpawnEnemies extends Component {
    constructor() {
        super();
        this.reset();
    }

    reset() {
        this.time = 0;
        this.delay = 1;
        this.emitting = true; 
        this.total_time = 0;
        this.duration = 10;
        this.cooldown = 25;
    }
 }