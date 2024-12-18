import { Canvas } from './canvas.js';

async function main() {
    // const data = await getData('test.txt');
    // const data = await getData('test_1.txt');
    const data = await getData('input.txt');
    //console.log(data);

    let maze = data.split('\r\n').map(r => r.split(''));
    function reset() {
        maze = data.split('\r\n').map(r => r.split(''));
    }

    let turn_cost = 1000;

    class Node {
        constructor(x, y, prevNode) {
            this.x = x;
            this.y = y;
            this.prevNode = prevNode;
            this.direction = null;
            this.cost = 0;
            this.setDirection();
            this.setCost();
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
        setCost() {
            if (!this.prevNode) {
                this.cost = 0;
            } else {
                this.cost = this.prevNode.cost + 1;
                if (shortestPathNodes.size > 0 && shortestPathNodes.has(`${this.x}|${this.y}`)) {
                    this.cost += 0.001;
                }
                if (this.direction != this.prevNode.direction) {
                    // update previous node cose
                    this.cost += turn_cost;
                }
            }
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

    let running = true;
    const canvas = new Canvas(maze);
    let shortestPathNodes;

    async function start() {
        reset();
        shortestPathNodes = new Set();
        canvas.draw();
        //console.log(startNode, target);
        const path = await solveDijkstra();
        drawPath(path);
        if(!running) return;
        console.log(`Lowest maze score is: ${path[path.length - 1]?.cost || 'error'}`);

        for (const node of path) {
            shortestPathNodes.add(`${node.x}|${node.y}`);
        }

        let count = 1;
        while (true) {
            let same = true;
            reset();
            const _path = await solveDijkstra();

            for (const node of _path) {
                if (!shortestPathNodes.has(`${node.x}|${node.y}`)) {
                    same = false;
                    shortestPathNodes.add(`${node.x}|${node.y}`);
                }
            }

            drawPath(_path);

            if (same) {
                console.log(`Shortest paths found: ${count}, total tiles: ${shortestPathNodes.size}`);
                break;
            }

            count++;
        }
        // draw all path found
        canvas.draw(Array.from(shortestPathNodes).map(n => {
            const node = new Node(n.split('|')[0], n.split('|')[1]);
            return node;
        }));
        _stop();
    }

    async function solveDijkstra() {
        let totalNodes = 2;
        for (const row of maze) {
            for (const col of row) {
                if (col == '.') {
                    totalNodes++;
                }
            }
        }

        const visited = new Map(); // To track visited nodes
        const queue = [];
        queue.push(startNode);

        while (queue.length > 0) {

            if (!running) {
                return [];
            }

            // sort node based on cost
            queue.sort((a, b) => a.cost - b.cost);
            let currentNode = queue.shift(); // Get the node with the lowest cost


            await new Promise(resolve => setTimeout(resolve, 0));
            canvas.draw(getPath(currentNode), visited);

            // Check if current node is the target
            if (currentNode.x == target.x && currentNode.y == target.y) {
                console.log('Maze exit found!');
                return getPath(currentNode);
            }

            // Skip if node has already been visited
            if (visited.has(`${currentNode.x}|${currentNode.y}|${currentNode.direction}`)) {
                continue;
            }

            //console.log(`Nodes checked: ${visited.size}/${totalNodes}`, queue.length);
            visited.set(`${currentNode.x}|${currentNode.y}|${currentNode.direction}`, currentNode);

            // Find adjacent nodes
            const adiacentNodes = [];
            for (const coords of availableDirections) {
                let _x = currentNode.x + coords[0];
                let _y = currentNode.y + coords[1];

                // Exclude walls
                if (maze[_y][_x] == '#') continue;
                if (currentNode.prevNode && _x == currentNode.prevNode.x && _y == currentNode.prevNode.y) continue;

                let _node = new Node(_x, _y, currentNode);
                adiacentNodes.push(_node);

                // Only add to the queue if the node hasn't been visited
                if (!visited.has(`${_node.x}|${_node.y}|${_node.direction}`)) {
                    // Add to queue and sort based on cost
                    queue.push(_node);
                } else {
                    // Update node cost if the new one is smaller
                    const existingNode = visited.get(`${_node.x}|${_node.y}|${_node.direction}`);
                    if (_node.direction == existingNode.direction && _node.cost <= existingNode.cost) {
                        existingNode.cost = _node.cost;
                        existingNode.prevNode = currentNode;
                    }
                }
            }
        }

        console.log('Path not found!');
        return [];
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

    function drawPath(path) {
        if(!path) return;
        let _maze = JSON.parse(JSON.stringify(maze))
        for (const node of path) {
            _maze[node.y][node.x] = node.direction;
        }
        //console.log(_maze.map(row => row.join('')).join('\r\n'));
    }


    const start_button = document.querySelector('#start');
    const stop_button = document.querySelector('#stop');
    const cost_selection = document.querySelector('#cost');

    start_button.onclick = _start;
    stop_button.onclick = _stop;

    function _start(){
        start_button.disabled = true;
        cost_selection.disabled = true;
        stop_button.removeAttribute('disabled');
        running = true;
        start();
    }

    function _stop(){
        running = false;
        start_button.removeAttribute('disabled');
        cost_selection.removeAttribute('disabled');

        stop_button.disabled = true;
    }


    cost_selection.onchange = () => {
        turn_cost = cost_selection.value;
    }
}

main();