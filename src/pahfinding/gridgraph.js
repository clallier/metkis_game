export default class GridGraph {

    constructor(grid_data, rows, cols) {
        this.nodes = new Map();
        this.edges = new Map();
        this.rows = rows;
        this.cols = cols;
        this.dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];

        // nodes
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const w = grid_data[y][x];
                const key = this.get_key(x, y);
                this.nodes.set(key, [x, y, w]);
            }
        }

        // edges
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const key = this.get_key(x, y);
                const node = this.nodes.get(key);
                const node_neighbors = this.compute_neighbors(node); 
                this.edges.set(key, node_neighbors);
            }
        }
    }

    get_key(x, y) {return y * this.cols + x;}
    is_valid(x, y) {return 0 <= x && x < this.cols && 0 <= y && y < this.rows;}

    compute_neighbors(node) {
        const edges = []
        for (let dir of this.dirs) {
            const x = node[0] + dir[0];
            const y = node[1] + dir[1];
            if(this.is_valid(x, y) == false) continue;
            const neighbor_key = this.get_key(x, y);
            const neighbor = this.nodes.get(neighbor_key);
            if(neighbor && neighbor[2] == 0)
                edges.push(neighbor);
        }
        return edges;
    }

    query_neighbors(node) {
        const neighbor_key = this.get_key(node[0], node[1]);
        return this.edges.get(neighbor_key);
    }

    query_node(x, y) {
        const key = this.get_key(x, y);
        return this.nodes.get(key);
    }
}