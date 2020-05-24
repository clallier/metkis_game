import GridGraph from "./gridgraph";
import BFS from "./bfs";

export default class MapLevel {
    constructor(data, blockers = []) {
        this.rows = data.length;
        this.cols = data[0].length;
        this.grid_data = [];
        this.start_node = null;

        for (let y = 0; y < this.rows; y++) {
            const row = [];
            for (let x = 0; x < this.cols; x++) {
                const tile_id = data[y][x];
                const w = blockers.includes(tile_id) ? 1: 0;
                row.push(w);

                // add start nodes
                if(tile_id == '9')
                    this.start_node = [x, y, w];
            }
            this.grid_data.push(row);
        }

        this.graph = new GridGraph(this.grid_data, this.rows, this.cols);
        this.bfs = new BFS(this.graph, this.start_node);
    }

    query_direction(x, y) {
        // FEAT : bilineare filtering : https://howtorts.github.io/2014/01/04/basic-flow-fields.html
        const node_key = this.graph.get_key(x, y);
        const node = this.bfs.came_from.get(node_key);
        if(node == null) return [0, 0];
        let dx = node[0] - x;
        let dy = node[1] - y; 
        return [dx, dy];
    }

    debug() {
        for (let y = 0; y < this.rows; y++) {
            const row = [];
            for (let x = 0; x < this.cols; x++) {
                const node_key = this.graph.get_key(x, y);
                let dist = this.bfs.distance.get(node_key);
                if(dist == null) dist = '##';
                else if(dist< 10) dist = '0'+ dist;
                else dist = '' + dist;
                row.push(dist);
            }
            console.log(row);
        }

        for (let y = 0; y < this.rows; y++) {
            const row = [];
            for (let x = 0; x < this.cols; x++) {
                const node_key = this.graph.get_key(x, y);
                const from_node = this.bfs.came_from.get(node_key);
                let dir = from_node == null ? ' ' :
                     this.get_debug_dir([x, y], from_node);
                row.push(dir);
            }
            console.log(row);
        }
    }

    get_debug_dir(node1, node2) {
        let ew = '';
        let dx = node2[0] - node1[0]; 
        if(dx < 0) ew = '←';
        else if(dx > 0) ew = '→';
        
        let ns = '';
        let dy = node2[1] - node1[1]; 

        if(dy < 0) ns = '↑';
        else if(dy > 0) ns = '↓';
        return ns+ew;
    }

}