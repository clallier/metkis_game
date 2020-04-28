import { Component, TagComponent } from "ecsy";
import CANNON from 'cannon';

// TODO move ToDelete to tagcomponents
export class ToDelete extends TagComponent {}


export class DeleteAfter extends Component {
    constructor() {
        super();
        // timer
        this.value = 0;
    }
    
    reset() {
        this.value = 0;
    }
}


// TODO move to BodyPhysics
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
        // body 
        this.value = null;
    }

    reset() {
        this.value = null;
    }
}