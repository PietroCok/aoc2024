async function main() {
    // const data = await getData('test.txt');
    // const data = await getData('test_1.txt');
    // const data = await getData('test_2.txt');
    const data = await getData('input.txt');

    //console.log(data);

    const map = {
        robot: {
            x: 0,
            y: 0,
            moves: [],
            lastMove: -1,
            displacement: {
                '<': [0, -1],
                '>': [0, 1],
                '^': [-1, 0],
                'v': [1, 0]
            }
        },
        init: function (data) {
            this.raw = data;
            this.parseRaw();
        },
        parseRaw: function () {
            const splitted = this.raw.split('\r\n\r\n');
            this.matrix = splitted[0].split('\r\n').map(r => r.split(''));

            _moves = splitted[1].split('\r\n').map(x => x.split(''));

            for (const moveSet of _moves) {
                this.robot.moves.push(...moveSet);
            }

            for (const [row_index, row] of this.matrix.entries()) {
                for (const [col_index, col] of row.entries()) {
                    if (col == '@') {
                        this.robot.y = row_index;
                        this.robot.x = col_index;
                    }
                }
            }
        },
        moveRobot: function (move) {

            if(move){
                this.robot.lastMove = -1;
                this.robot.moves = [move];
            }

            while (this.robot.lastMove + 1 < this.robot.moves.length) {
                this.robot.lastMove += 1;
                let nextMove = this.robot.moves[this.robot.lastMove];

                console.log('\r');
                console.log('Next move:', nextMove, `(${this.robot.lastMove})`);

                let [diffY, diffX] = this.robot.displacement[nextMove];
                let nextX = this.robot.x + diffX;
                let nextY = this.robot.y + diffY;

                if (this.matrix[nextY][nextX] == '#') {
                    // do nothing
                    console.log('cannot move');
                } else if (this.matrix[nextY][nextX] == 'O') {
                    // check if can push
                    const moved = this.checkAndMoveBoxes(nextX, nextY, diffX, diffY);

                    if (moved) {
                        this.moveRobotTo(nextX, nextY);
                        console.log('Robot and boxes moved');
                    } else {
                        console.log('Unmovable box found');

                    }
                } else if (this.matrix[nextY][nextX] == '[' || this.matrix[nextY][nextX] == ']') {
                    // check if can push
                    const moved = this.checkAndMoveBoxes(nextX, nextY, diffX, diffY);

                    if (moved) {
                        this.moveRobotTo(nextX, nextY);
                        console.log('Robot and boxes moved');
                    } else {
                        console.log('Unmovable box found');
                    }
                } else {
                    // move there
                    this.moveRobotTo(nextX, nextY);
                    console.log('Robot moved alone');
                }

                this.viewMap();
            }
        },
        checkAndMoveBoxes: function (currentX, currentY, diffX, diffY) {
            let _nextX = currentX + diffX;
            let _nextY = currentY + diffY;
            if (this.matrix[_nextY][_nextX] == '#') {
                // cannot move
                return false;
            }

            let canMove = false;
            if (this.matrix[_nextY][_nextX] == 'O') {
                // check if can move next box
                canMove = this.checkAndMoveBoxes(_nextX, _nextY, diffX, diffY);
            }

            let canMoveDouble = false;
            if (diffY == 0) {
                if (this.matrix[_nextY][_nextX] == '[' || this.matrix[_nextY][_nextX] == ']') {
                    canMove = this.checkAndMoveBoxes(_nextX, _nextY, diffX, diffY);
                }
            } else {
                if(this.matrix[currentY][currentX] == '['){
                    canMoveDouble = this.checkBoxes(currentX, currentY, diffX, diffY);
                    canMoveDouble = canMoveDouble && this.checkBoxes(currentX + 1, currentY, diffX, diffY);
                } 
                if(this.matrix[currentY][currentX] == ']'){
                    canMoveDouble = this.checkBoxes(currentX - 1, currentY, diffX, diffY);
                    canMoveDouble = canMoveDouble && this.checkBoxes(currentX, currentY, diffX, diffY);
                }

                if (canMoveDouble) {
                    // boxes can move
                    this.checkBoxes(currentX, currentY, diffX, diffY, true);
                    return true;
                }

                return false;
            }

            if (this.matrix[_nextY][_nextX] == '.') {
                // next position is free
                this.moveBoxTo(currentX, currentY, _nextX, _nextY);
                return true;
            }

            if (canMove) {
                // boxes can move
                this.moveBoxTo(currentX, currentY, _nextX, _nextY);
                return true;
            }

            return canMove || canMoveDouble;
        },
        checkBoxes: function (currentX, currentY, diffX, diffY, move = false) {
            // check boxes for part 2
            // return false if at least 1 box cannot be moved
            // move == true => move the box when possible
            let _nextX = currentX + diffX;
            let _nextY = currentY + diffY;
            let canBeMoved = false;
            let canBeMovedLeft = false;
            let canBeMovedRight = false;

            if (this.matrix[currentY][currentX] == '.') {
                return true;
            }

            if (this.matrix[currentY][currentX] == '[') {
                canBeMovedLeft = this.checkBoxes(_nextX, _nextY, diffX, diffY, move);
                canBeMovedRight = this.checkBoxes(_nextX + 1, _nextY, diffX, diffY, move);
                canBeMoved = canBeMovedLeft && canBeMovedRight;
            }

            if (this.matrix[currentY][currentX] == ']') {
                canBeMovedLeft = this.checkBoxes(_nextX - 1, _nextY, diffX, diffY, move);
                canBeMovedRight = this.checkBoxes(_nextX, _nextY, diffX, diffY, move);
                canBeMoved = canBeMovedLeft && canBeMovedRight;
            }
            
            if (canBeMoved && move) {
                if (this.matrix[currentY][currentX] == '[') {
                    this.moveBoxTo(currentX, currentY, _nextX, _nextY)
                    this.moveBoxTo(currentX + 1, currentY, _nextX + 1, _nextY)
                } else {
                    this.moveBoxTo(currentX - 1, currentY, _nextX - 1, _nextY)
                    this.moveBoxTo(currentX, currentY, _nextX, _nextY)
                }
            }

            return canBeMoved;
        },
        moveRobotTo: function (x, y) {
            this.moveTo(this.robot.x, this.robot.y, x, y, '@')
            this.robot.x = x;
            this.robot.y = y;
        },
        moveBoxTo: function (fromX, fromY, toX, toY) {
            let boxType = this.matrix[fromY][fromX];
            this.moveTo(fromX, fromY, toX, toY, boxType)
        },
        moveTo: function (fromX, fromY, toX, toY, char) {
            // remove robot from previos position
            this.matrix[fromY][fromX] = '.';
            this.matrix[toY][toX] = char;
        },
        getScore: function () {
            let score = 0;
            for (const [row_index, row] of this.matrix.entries()) {
                for (const [col_index, col] of row.entries()) {
                    if (col == 'O') {
                        score += (100 * row_index) + col_index;
                    }
                }
            }


            for (const [row_index, row] of this.matrix.entries()) {
                for (const [col_index, col] of row.entries()) {
                    if (col == '[') {
                        score += (100 * row_index) + col_index;
                    }
                }
            }
            return score;
        },
        viewMap: function () {
            console.log(this.matrix.map(r => r.join('')).join('\r\n'))
        }
    }

    map.init(data);
    console.log(map);
    map.moveRobot();
    console.log(`Part 1 solution: ${map.getScore()}`);


    // convert map for part 2
    const double_data = data.replaceAll('#', '##').replaceAll('O', '[]').replaceAll('.', '..').replaceAll('@', '@.');
    map.init(double_data);
    map.viewMap();
    map.moveRobot();
    console.log(`Part 2 solution: ${map.getScore()}`);

    // will allow to manually move the robot around
    window.addEventListener('keypress', (evt) => {
        console.clear()
        switch (evt.key) {
            case 'a':
                map.moveRobot('<');
                break;
            case 'd':
                map.moveRobot('>');
                break;
            case 'w':
                map.moveRobot('^');
                break;
            case 's':
                map.moveRobot('v');
                break;
        }
    })

}




main();