async function main() {
    // const data = await getData('test.txt');
    // const data = await getData('test_1.txt');
    const data = await getData('input.txt');

    console.log(data);


    const maze = data.split('\r\n').map(r => r.split(''));
    maze.toString = function () {
        return this.map(r => r.join('')).join('\r\n');
    }

    class Node {
        constructor(x, y, prevNode) {
            this.x = x;
            this.y = y;
            this.prevNode = prevNode;
            this.direction = null;
            this.cost = 0;
            this.setDirection();
            this.getCost();
        }
        setDirection() {
            if (this.prevNode) {
                const diffX = this.x - this.prevNode.x;
                const diffY = this.y - this.prevNode.y;
                if (diffX == 0 && diffY == 1) {
                    this.direction = 'v';
                }
                if (diffX == 1 && diffY == 0) {
                    this.direction = '>';
                }
                if (diffX == 0 && diffY == -1) {
                    this.direction = '^';
                }
                if (diffX == -1 && diffY == 0) {
                    this.direction = '<';
                }
            }
        }
        getCost() {
            if(!this.prevNode){
                this.cost = 0;
            } else {
                this.cost = this.prevNode.cost + 1;
                if(this.direction != this.prevNode.direction){
                    this.cost += 1000;
                }
            }
            return this.cost;
        }
    }
    const availableDirections = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
    ]
    const target = {
        x: 0,
        y: 0
    }
    let startNode;
    // find start and end cell
    for (const [row_index, row] of maze.entries()) {
        for (const [col_index, col] of row.entries()) {
            if (col == 'S') {
                startNode = new Node(col_index, row_index, null);
                startNode.direction = '>';
            } else if (col == 'E') {
                target.x = col_index;
                target.y = row_index;
            }
        }
    }
    //console.log(startNode, target);
    const path = solveDijkstra();
    drawPath(path);
    console.log(path);
    console.log(maze.toString());
    console.log(`Lowest maze score is: ${path[path.length - 1]?.cost || 'error'}`);
    // 72432 => high
    
    
    function solveDijkstra() {
        let totalNodes = 2;
        for (const row of maze) {
            for (const  col of row) {
                if (col == '.') {
                    totalNodes++;
                }
            }
        }

        const visited = new Map(); // To track visited nodes
        const queue = [];
        queue.push(startNode);
        
        while (queue.length > 0) {
            // sort node based on cost
            queue.sort((a, b) => a.cost - b.cost);
            let currentNode = queue.shift(); // Get the node with the lowest cost

            
            // Check if current node is the target
            if (currentNode.x == target.x && currentNode.y == target.y) {
                console.log('Maze exit found!');
                const path = [];
                let current = currentNode;
                while (current) {
                    path.push(current);
                    current = current.prevNode;
                }
                return path.reverse();
            }
            
            // Skip if node has already been visited
            if (visited.has(`${currentNode.x}|${currentNode.y}`)) {
                continue;
            }
            
            console.log(`Checked nodes: ${visited.size}/${totalNodes}`);
            
            visited.set(`${currentNode.x},${currentNode.y}`, currentNode);
    
            // Find adjacent nodes
            const adiacentNodes = [];
            for (const coords of availableDirections) {
                let _x = currentNode.x + coords[0];
                let _y = currentNode.y + coords[1];
    
                // Exclude walls
                if (maze[_y][_x] != '#') {
                    let _node = new Node(_x, _y, currentNode);
                    adiacentNodes.push(_node);
    
                    // Only add to the queue if the node hasn't been visited
                    if (!visited.has(`${_node.x}|${_node.y}`)) {
                        // Add to queue and sort based on cost
                        queue.push(_node);
                    } else {
                        // Update node cost if the new one is smaller
                        const existingNode = visited.get(`${_node.x}|${_node.y}`);
                        if (_node.cost < existingNode.cost) {
                            existingNode.cost = _node.cost;
                            existingNode.prevNode = currentNode;
                        }
                    }
                }
            }
        }
    
        console.log('Path not found!');
        return [];
    }

    function drawPath(path) {
        for (const node of path) {
            maze[node.y][node.x] = node.direction;
        }
    }
}

main();