async function main() {
    // const data = await getData('test.txt');
    const data = await getData('input.txt');

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

    // first key is FROM, second key is TO
    const optimalMoves_dirPad = {
        "A": {
            "v": ["v", "<"], // ?
            "<": ["v", "<", "<"],
            ">": ["v"],
            "^": ["<"],
            "A": []
        },
        "v": {
            "A": [">", "^"], // ?
            "<": ["<"],
            ">": [">"],
            "^": ["^"],
            "v": []
        },
        "<": {
            "v": [">"],
            "A": [">", ">", "^"],
            ">": [">", ">"],
            "^": [">", "^"],
            "<": []
        },
        ">": {
            "v": ["<"],
            "<": ["<", "<"],
            "A": ["^"],
            "^": ["<", "^"], // ?
            ">": []
        },
        "^": {
            "v": ["v"],
            "<": ["v", "<"],
            "A": [">"],
            "^": [],
            ">": ["v", ">"] // ?
        }
    }

    const optimalMoves_numPad = {
        "A": {
            "A": [],
            "0": ["<"],
            "1": ["^", "<", "<"],
            "2": ["<", "^"], // ???
            "3": ["^"],
            "4": ["^", "^", "<", "<"],
            "5": ["<", "^", "^"], // ???
            "6": ["^", "^"],
            "7": ["^", "^", "^", "<", "<"],
            "8": ["^", "^", "^", "<"], // ???
            "9": ["^", "^", "^"]
        },
        "0": {
            "A": [">"],
            "0": [],
            "1": ["^", "<"],
            "2": ["^"],
            "3": [">", "^"],
            "4": ["^", "^", "<"],
            "5": ["^", "^"],
            "6": [">", "^", "^"],
            "7": ["^", "^", "^", "<"],
            "8": ["^", "^", "^"],
            "9": ["^", "^", "^", ">"]
        },
        "1": {
            "A": [">", ">", "v"],
            "0": [">", "v"],
            "1": [],
            "2": [">"],
            "3": [">", ">"],
            "4": ["^"],
            "5": ["^", ">"],
            "6": [">", ">", "^"],
            "7": ["^", "^"],
            "8": ["^", "^", ">"],
            "9": ["^", "^", ">", ">"]
        },
        "2": {
            "A": [],
            "0": [],
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
            "7": [],
            "8": [],
            "9": []
        },
        "3": {
            "A": [],
            "0": [],
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
            "7": [],
            "8": [],
            "9": []
        },
        "4": {
            "A": [],
            "0": [],
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
            "7": [],
            "8": [],
            "9": []
        },
        "5": {
            "A": [],
            "0": [],
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
            "7": [],
            "8": [],
            "9": []
        },
        "6": {
            "A": [],
            "0": [],
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
            "7": [],
            "8": [],
            "9": []
        },
        "7": {
            "A": [],
            "0": [],
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
            "7": [],
            "8": [],
            "9": []
        },
        "8": {
            "A": [],
            "0": [],
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
            "7": [],
            "8": [],
            "9": []
        },
        "9": {
            "A": [],
            "0": [],
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
            "7": [],
            "8": [],
            "9": []
        }
    }

    // saves moves for a pad from a position to a specific simbol
    let cache = new Map();

    // part 1
    const codesMoves = {}
    let robots = 2;
    for (const code of codes) {
        // first get the moves from numpad to dirpad
        let baseInputs = [];
        let startSimbol = 'A';
        for (const simbol of code.split('')) {
            baseInputs = [...baseInputs, ...getMoves(numPad, startSimbol, simbol)];
            startSimbol = simbol;
        }

        codesMoves[code] = [];
        // this should get all the moves
        startSimbol = 'A';
        for (const move of baseInputs) {
            codesMoves[code] = [...codesMoves[code], ...getMoves(dirPad, startSimbol, move, robots)];
            startSimbol = move;
        }
    }

    // Calculate complexity
    let totalComplexity = 0;
    for (const [code, moves] of Object.entries(codesMoves)) {
        totalComplexity += getCodeComplexity(code, moves);
    }
    console.log(`Part 1: Total codes complexity is: ${totalComplexity}`);


    // Part 2
    robots = 25;
    for (const code of codes) {
        // first get the moves from numpad to dirpad
        let baseInputs = [];
        let startSimbol = 'A';
        for (const simbol of code.split('')) {
            baseInputs = [...baseInputs, ...getMoves(numPad, startSimbol, simbol)];
            startSimbol = simbol;
        }

        codesMoves[code] = 0;
        // this should get all the moves
        startSimbol = 'A';
        for (const move of baseInputs) {
            let __moves = [];
            if (cache.has(`${dirPad[0][0]}|${startSimbol}|${move}|${robots-1}`)) {
                __moves = cache.get(`${dirPad[0][0]}|${startSimbol}|${move}|${robots-1}`)
            } else {
                __moves = getMovesNumber(dirPad, startSimbol, move, robots)
            }
            codesMoves[code] += __moves;
            startSimbol = move;
        }
    }

    // Calculate complexity
    totalComplexity = 0;
    for (const [code, moves] of Object.entries(codesMoves)) {
        totalComplexity += getCodeComplexity(code, moves);
    }
    console.log(`Part 2: Total codes complexity is: ${totalComplexity}`);
    console.log(cache);

    // calculate code complexity
    function getCodeComplexity(code, inputs) {
        const numericPart = Number(code.slice(0, 3));
        const moveLength = typeof inputs == 'number' ? inputs : inputs.length;
        console.log(`${code}: ${moveLength} => ${moveLength * numericPart}`);
        return moveLength * numericPart | 0;
    }

    // 918361322 => low




    
    // get move list from one position to another
    function getMoves(pad, startSimbol, endSimbol, level = 0) {
        level -= 1;
        const startSimbolPos = getSimbolPos(pad, startSimbol);
        const endSimbolPos = getSimbolPos(pad, endSimbol);
        let moves = [];
        if (pad.length == 2) {
            moves = [...optimalMoves_dirPad[startSimbol][endSimbol], "A"];
        } else {
            let diffX = endSimbolPos.x - startSimbolPos.x;
            let diffY = endSimbolPos.y - startSimbolPos.y;

            let horiz = '>';
            let vert = '^';
            if (diffX < 0) horiz = '<';
            if (diffY > 0) vert = 'v';
            let _diffX = Math.abs(diffX);
            let _diffY = Math.abs(diffY);
            while (_diffX > 0) {
                moves.push(horiz);
                _diffX--;
            }
            while (_diffY > 0) {
                moves.push(vert);
                _diffY--;
            }

            if (!checkPathBounds(pad, startSimbolPos, moves)) {
                moves.reverse();
            }

            moves.push('A');
        }


        // if more robot are present get the correct move for the next one
        if (level > 0) {
            let _moves = [];
            let _startSimbol = 'A';

            for (const nextSimbol of moves) {
                _moves = [..._moves, ...getMoves(pad, _startSimbol, nextSimbol, level)];
                _startSimbol = nextSimbol;
            }

            return _moves;
        }

        return moves;
    }

    // get move list from one position to another
    function getMovesNumber(pad, startSimbol, endSimbol, level = 0) {
        level -= 1;
        const startSimbolPos = getSimbolPos(pad, startSimbol);
        const endSimbolPos = getSimbolPos(pad, endSimbol);
        let moves = [];
        if (pad.length == 2) {
            moves = [...optimalMoves_dirPad[startSimbol][endSimbol], "A"];
        } else {
            let diffX = endSimbolPos.x - startSimbolPos.x;
            let diffY = endSimbolPos.y - startSimbolPos.y;

            let horiz = '>';
            let vert = '^';
            if (diffX < 0) horiz = '<';
            if (diffY > 0) vert = 'v';
            let _diffX = Math.abs(diffX);
            let _diffY = Math.abs(diffY);
            while (_diffX > 0) {
                moves.push(horiz);
                _diffX--;
            }
            while (_diffY > 0) {
                moves.push(vert);
                _diffY--;
            }

            if (!checkPathBounds(pad, startSimbolPos, moves)) {
                moves.reverse();
            }

            moves.push('A');
        }

        // if more robot are present get the correct move for the next one
        if (level > 0) {
            if (cache.has(`${pad[0][0]}|${startSimbol}|${endSimbol}|${level}`)) {
                return cache.get(`${pad[0][0]}|${startSimbol}|${endSimbol}|${level}`)
            }

            let _moves = 0;
            let _startSimbol = 'A';

            for (const nextSimbol of moves) {
                _moves += getMovesNumber(pad, _startSimbol, nextSimbol, level);
                _startSimbol = nextSimbol;
            }

            cache.set(`${pad[0][0]}|${startSimbol}|${endSimbol}|${level}`, _moves);

            return _moves;
        }

        cache.set(`${pad[0][0]}|${startSimbol}|${endSimbol}|${level}`, moves.length);

        return moves.length;
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