async function main() {
    const data = await getData('test.txt');
    // const data = await getData('input.txt');

    console.log(data);

    /*
    +---+---+---+
    | 7 | 8 | 9 |
    +---+---+---+
    | 4 | 5 | 6 |
    +---+---+---+
    | 1 | 2 | 3 |
    +---+---+---+
        | 0 | A |
        +---+---+

        +---+---+
        | ^ | A |
    +---+---+---+
    | < | v | > |
    +---+---+---+
    */

    const codes = data.split('\r\n');

    const numPad = [
        [7, 8, 9],
        [4, 5, 6],
        [1, 2, 3],
        ['.', 0, 'A']
    ]

    const dirPad = [
        ['.', '^', 'A'],
        ['<', 'v', '>']
    ]

    const directions = {
        '>': [1, 0],
        '<': [-1, 0],
        'v': [0, 1],
        '^': [0, -1]
    }

    const dirWeight = {
        '<': [-1, 0],
        '>': [1, 0],
        '^': [0, -1],
        'v': [0, 1],
    }
    // saves moves for a pad from a position to a specific simbol
    let cache = new Map();


    // part 1
    const codesMoves = {}
    const robots = 2;
    for (const code of codes) {
        let baseInputs = [];
        let startSimbol = 'A';
        for (const simbol of code.split('')) {
            baseInputs.push(getMoves(numPad, startSimbol, simbol));
            startSimbol = simbol;
        }

        codesMoves[code] = [];
        // get all moves for the base inputs
        for (const moves of baseInputs) {
            for (const move of moves) {
                codesMoves[code] = [...codesMoves[code], ...getMoves(dirPad, 'A', move, robots)];
            }
        }
    }
    console.log(codesMoves);



    let totalComplexity = 0;
    for (const [code, moves] of Object.entries(codesMoves)) {
        totalComplexity += getCodeComplexity(code, moves);
    }
    console.log(`Par 1: Total codes complexity is: ${totalComplexity}`);



    // calculate code complexity
    function getCodeComplexity(code, inputs) {
        const numericPart = Number(code.slice(0, 3));
        console.log(`${code}: ${inputs?.length} => ${inputs?.length * numericPart}`);
        return inputs?.length * numericPart | 0;
    }

    // get move list from one position to another
    function getMoves(pad, startSimbol, endSimbol, level = 0) {
        const startSimbolPos = getSimbolPos(pad, startSimbol);
        const endSimbolPos = getSimbolPos(pad, endSimbol);
        let moves = [];
        const h_moves = [];
        const v_moves = [];
        let diffX = endSimbolPos.x - startSimbolPos.x;
        let diffY = endSimbolPos.y - startSimbolPos.y;

        let horiz = '>';
        let vert = '^';
        if (diffX < 0) horiz = '<';
        if (diffY > 0) vert = 'v';
        let _diffX = Math.abs(diffX);
        let _diffY = Math.abs(diffY);
        while (_diffX > 0) {
            h_moves.push(horiz);
            _diffX--;
        }
        while (_diffY > 0) {
            v_moves.push(vert);
            _diffY--;
        }

        if (diffX > 0) {
            moves = [...v_moves, ...h_moves]
        } else {
            moves = [...h_moves, ...v_moves]
        }

        if (!checkPathBounds(pad, startSimbolPos, moves)) {
            moves.reverse();
        }

        moves.push('A');

        // if more robot are present get the correct move for the next one
        level -= 1;
        if (level > 0) {
            let _moves = [];
            let _startSimbol = 'A';
            for (const nextSimbol of moves) {
                _moves = [..._moves, ...getMoves(pad, _startSimbol, nextSimbol, level)];
                _startSimbol = nextSimbol;
            }
            // console.log(`\nFrom ${startSimbol} to ${endSimbol} - level ${level}`);
            // console.log(moves, _moves);
            return _moves;
        }
        return moves;
    }



    function checkPathBounds(pad, startPos, path) {
        let currentPos = {
            x: startPos.x,
            y: startPos.y,
            move: function ([x, y]) {
                this.x += x;
                this.y += y;
            }
        };
        for (const move of path) {
            currentPos.move(directions[move]);
            if (pad[currentPos.y][currentPos.x] == '.') {
                return false;
            }
        }
        return true;
    }

    // get simbol position in a particular pad
    function getSimbolPos(pad, simbol) {
        let simbolPos = null;
        for (const [row_index, row] of pad.entries()) {
            for (const [col_index, col] of row.entries()) {
                if (col == simbol) {
                    simbolPos = {
                        x: col_index,
                        y: row_index
                    }
                    break;
                }
            }
            if (simbolPos) break;
        }
        if (!simbolPos) console.log(`Simbol ${simbol} not found in provided pad!`);
        return simbolPos;
    }
}




main();