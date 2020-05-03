import { Component, TagComponent } from "ecsy";

export class CameraTarget extends TagComponent { }
export class Controllable extends TagComponent { }

export class GroupEnemy extends TagComponent { }
export class GroupPlayer extends TagComponent { }
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
        this.idle = [];
        // TODO add more animations
    }
}

export class MeshAnimation extends Component {
    constructor() {
        super();
        this.reset();
    }

    reset() {
        this.time = 0;
        this.current_animation = null;
        this.current_animation_duration = 0;
        this.target = null;
        this.attack = null;
        this.idle = null;
        // TODO add more animations
    }
 }

 export class ChangeAnimation extends Component {
    constructor() {
        super();
        this.reset();
    }

    reset() {
        this.current_animation = null;
        this.current_animation_duration = 0;
        this.target = null;
    }
 }

// TODO weapon component 
export class DistanceWeapon extends Component {
    constructor() {
        super();
        this.reset();
    }

    reset() {
        // in s
        this.time = 10;
        this.delay = 0.1;
        this.impulse_speed = 5;
        this.impulse_y = 0;
        this.target = null;
        this.time_to_next_target = 10;
        this.delay_to_next_target = 0.5;
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
        this.delay = 0.5;
        this.emitting = true; 
        this.total_time = 0;
        this.duration = 10;
        this.cooldown = 25;
    }
 }

 export class Drop extends Component {
    constructor() {
        super();
        this.reset();
    }

    reset() {
        // the item to drop on death
        this.value = null;
    }
 }