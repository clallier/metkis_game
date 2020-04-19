export default class EntityArray {
    constructor() {
        this.array = [];
        this.addQueue = [];
        this.removeQueue = [];
    }

    add(element) {
        this.addQueue.push(element);
    }

    remove(element) {
        this.removeQueue.add(element);
    }

    forEach(fn) {
        this.mergeAddQueue();

        // TODO
        // if (this.removeQueue.size) {
        //     this.array = this.array.filter(element => !this.removeQueue.has(element));
        //     this.removeQueue.clear();
        // }


        for (const element of this.array) {
            // if (this.removeQueue.has(element)) {
            //     continue;
            // }
            fn(element);
        }
    }

    mergeAddQueue() {
        this.array = this.array.concat(this.addQueue);
        this.addQueue = [];
    }
}