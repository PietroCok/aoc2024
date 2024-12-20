async function main() {
    // const data = await getData('test.txt');
    const data = await getData('input.txt');

    console.log(data);

    const maze = data.split('\r\n').map(row => row.split(''));

    class Node {
        constructor(x, y, prevNode) {
            this.x = x;
            this.y = y;
            this.prevNode = prevNode;
            this.cost = 0;
            this.setCost();
        }
        setCost() {
            if (!this.prevNode) {
                this.cost = 0;
            } else {
                this.cost = this.prevNode.cost + 1;
            }
        }
    }
    const availableDirections = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
    ]

    let startNode;
    let targetNode;

    for(const [row_index, row] of maze.entries()){
        for(const [col_index, col] of row.entries()){
            if(col == 'S'){
                startNode = new Node(col_index, row_index);
            }

            if(col == 'E'){
                targetNode = new Node(col_index, row_index);
            }
        }
    }

    const defaultPath = await solveDijkstra(maze);
    // drawPath(maze, defaultPath);
    console.log(`Default race is completed in ${defaultPath.length} picosecond(s)`);

    // Part 1
    const radius = 2;
    let count = 0;
    let threshold = 100;
    for(const node of defaultPath){
        count += findCheats(defaultPath, node, radius, threshold);
    }
    console.log(`Part 1: found ${count} cheats that save at least ${threshold} picoseconds - cheat max length: ${radius} picosecond(s)`);
    

    // Part 2
    const _radius = 20;
    let _count = 0;
    let _threshold = 100;
    for(const node of defaultPath){
        _count += findCheats(defaultPath, node, _radius, _threshold);
    }
    console.log(`Part 2: found ${_count} cheats that save at least ${_threshold} picoseconds - cheat max length: ${_radius} picosecond(s)`);

    async function solveDijkstra(maze, maxSkip = 0) {
        let totalNodes = 2;
        for (const row of maze) {
            for (const col of row) {
                if (col == '.') {
                    totalNodes++;
                }
            }
        }

        let visited = new Map(); // To track visited nodes
        const queue = [];
        queue.push(startNode);

        while (queue.length > 0) {

            // sort node based on cost
            queue.sort((a, b) => a.cost - b.cost);
            let currentNode = queue.shift(); // Get the node with the lowest cost

            // Check if current node is the target
            if (currentNode.x == targetNode.x && currentNode.y == targetNode.y) {
                console.log('Maze exit found!');
                return getPath(currentNode);
            }

            // Skip if node has already been visited
            if (visited.has(`${currentNode.x}|${currentNode.y}`)) {
                continue;
            }

            //console.log(`Nodes checked: ${visited.size}/${totalNodes}`, queue.length);
            visited.set(`${currentNode.x}|${currentNode.y}`, currentNode);

            // Find adjacent nodes
            const adiacentNodes = [];
            for (const coords of availableDirections) {
                let _x = currentNode.x + coords[0];
                let _y = currentNode.y + coords[1];
                // check if inside the maze
                if (_x < 0 || _x >= maze[0].length) continue;
                if (_y < 0 || _y >= maze.length) continue;
                // Exclude walls
                if (maze[_y][_x] == '#') continue;
                // avoid backtracking
                if (currentNode.prevNode && _x == currentNode.prevNode.x && _y == currentNode.prevNode.y) continue;

                let _node = new Node(_x, _y, currentNode);
                adiacentNodes.push(_node);

                // Only add to the queue if the node hasn't been visited
                if (!visited.has(`${_node.x}|${_node.y}`)) {
                    // Add to queue and sort based on cost
                    queue.push(_node);
                } else {
                    // Update node cost if the new one is smaller
                    const existingNode = visited.get(`${_node.x}|${_node.y}`);
                    if (_node.cost <= existingNode.cost) {
                        existingNode.cost = _node.cost;
                        existingNode.prevNode = currentNode;
                    }
                }
            }
        }

        function getPath(node) {
            const path = [];
            let current = node;
            while (current) {
                path.push(current);
                current = current.prevNode;
            }
            return path.reverse();
        }

        console.log('Path not found!');
        return [];
    }

    function drawPath(maze, path){
        const _maze = JSON.parse(JSON.stringify(maze));
        for(const node of path){
            if(_maze[node.y][node.x] == '.'){
                _maze[node.y][node.x] = 'O';
            }
        }
        console.log(_maze.map(row => row.join('')).join('\r\n'));
    }

    // return count of valid cheats
    function findCheats(path, currentNode, radius, threshold){
        let count = 0;
        // get all next elements in the path
        for(let i = path.findIndex(node => node.x == currentNode.x && node.y == currentNode.y); i < path.length; i++){
            const _node = path[i];
            // direct distance is distance without walls
            const directDistance = getDirectDistance(_node, currentNode);
            // real distance is distance following the race track
            const realDistance = _node.cost - currentNode.cost;
            // if direct is less than cheat length
            if(directDistance <= radius){
                const savedDistance = realDistance - directDistance;
                // check if saved time is enough
                if(savedDistance >= threshold){
                    count++;
                }
            }
        }
        return count;
    }

    function getDirectDistance(A, B){
        const diffX = Math.abs(A.x - B.x);
        const diffY = Math.abs(A.y - B.y);
        return diffX + diffY;
    }
}




main();