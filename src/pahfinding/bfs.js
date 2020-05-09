export default class BFS {
    // TODO list of start nodes
    constructor(graph, start_node) {
        let curr_key = graph.get_key(start_node[0], start_node[1]);
        let next_key = "";
        let curr_dist = 0;
        let next_dist = 0;
        let current = [];
        let next = [];
        let neighbors = [];

        this.graph = graph;
        // a list of nodes
        this.frontier = [];
        this.frontier.push(start_node);

        // a map of [key, node]  
        this.came_from = new Map();
        this.came_from.set(curr_key, null);

        this.distance = new Map();
        this.distance.set(curr_key, 0);


        while(this.frontier.length > 0) {
            current = this.frontier.pop(); //shift();
            curr_key = graph.get_key(current[0], current[1]);
            curr_dist = this.distance.get(curr_key);
            neighbors = graph.query_neighbors(current);

            for(next of neighbors) {
                next_key = graph.get_key(next[0], next[1]);
                next_dist = this.distance.get(next_key)
                if(next_dist == null || 1 + curr_dist < next_dist ) {
                    this.frontier.push(next);
                    this.came_from.set(next_key, current);
                    this.distance.set(next_key, 1 + curr_dist);
                }
            }
        }
    }
}