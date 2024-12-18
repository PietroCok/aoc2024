import { Canvas } from './canvas.js';


async function main() {
    // const data = await getData('test.txt');
    // const size = 6;
    
    const data = await getData('input.txt');
    const size = 71;

    // console.log(data);

    const bytes = [];
    for (const byte of data.split('\r\n')) {
        bytes.push(byte.split(','));
    }
    // console.log(bytes);
    const grid = [];
    for (let i = 0; i < size; i++) {
        let row = new Array(size);
        row.fill('.');
        grid.push(row);
    }

    // console.log(grid);

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
    function corrupTMemory(n, startFrom = 0) {
        const _n = bytes.length > n ? n : bytes.length;
        let lastByte;
        for (let i = startFrom; i < startFrom+_n; i++) {
            const byte = bytes[i];
            grid[byte[1]][byte[0]] = '#';
            lastByte = byte;
        }
        return lastByte;
    }

    // Dijkstra implementation from day 14
    // removed directions
    async function solveDijkstra() {
        let totalNodes = 2;
        for (const row of grid) {
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
                // check if inside the grid
                if (_x < 0 || _x >= size) continue;
                if (_y < 0 || _y >= size) continue;
                // Exclude walls
                if (grid[_y][_x] == '#') continue;
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

    const startNode = new Node(0, 0);
    const targetNode = {
        x: size-1,
        y: size-1
    }
    const canvas = new Canvas(grid);
    // acutal program
    let falled = 1024;
    corrupTMemory(falled);
    let path = await solveDijkstra();

    console.log(`Number of steps after 1024 bytes corruption: ${path.length-1}`);
    
    let blocked = false;
    while(!blocked){
        let byte = corrupTMemory(1, falled);
        falled++;
        path = await solveDijkstra();
        await new Promise(resolve => setTimeout(resolve, 0));
        if(path.length <= 0){
            console.log(`First byte that blocks the exit is (${falled}): ${byte.join(',')}`);
            break;
        }
        canvas.draw(path);
    }
}




main();