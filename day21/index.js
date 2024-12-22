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

    const dirWeight = {
        '<': [-1, 0],
        '>': [1, 0],
        '^': [0, -1],
        'v': [0, 1],
    }
    // saves moves for a pad from a position to a specific simbol
    let cache = new Map();


    // part 1
    const inputs1 = [];
    const inputs2 = [];
    const inputs3 = [];
    
    // recupera primo layer (robottino 1)
    for(const code of codes){
        inputs1.push(getInputs(numPad, code));
    }
    // recupera secondo layer (robottino 2)
    for(const input1 of inputs1){
        inputs2.push(getInputs(dirPad, input1));
    }
    // recupera terzo layer (umano)
    for(const input2 of inputs2){
        inputs3.push(getInputs(dirPad, input2));
    }
    
    let totalComplexity_p1 = 0;
    for(let i = 0; i < codes.length; i++){
        totalComplexity_p1 += getCodeComplexity(codes[i], inputs3[i])
    }
    console.log(`Par 1: Total codes complexity is: ${totalComplexity_p1}`);


    // part 2
    // maybe it's best to solve like the stones problem (go over everty start digits of every code, and count the total moves required) cache should considere also number of robots left in the sequence
    const inputs_p2 = [];
    for(const code of codes){
        inputs_p2.push(getInputs(numPad, code));
    }

    const robots = 8;
    const inputs2_p2 = [];
    for(const _code of inputs_p2){
        let _tmp = [..._code]
        for(let i = 0; i < robots; i++){
            console.log(i, _tmp.length);
            _tmp = getInputs(dirPad, _tmp);
        }
        inputs2_p2.push(_tmp);
    }
    console.log(inputs2_p2);

    let totalComplexity_p2 = 0;
    for(let i = 0; i < codes.length; i++){
        totalComplexity_p2 += getCodeComplexity(codes[i], inputs2_p2[i])
    }
    console.log(`Par 2: Total codes complexity is: ${totalComplexity_p2}`);


    // calculate code complexity
    function getCodeComplexity(code, inputs){
        const numericPart = Number(code.slice(0, 3));
        console.log(code, inputs.length, numericPart);
        return inputs.length * numericPart;
    }


    // gets move sequence on selected pad given a code
    function getInputs(pad, code){
        let lastPosition = getSimbolPos(pad, 'A');
        let _inputs = []
        for(const simbol of code){
            const input = getInput(pad, simbol, lastPosition);
            // update last position for next iteration
            lastPosition = input.pos;
            _inputs = [..._inputs, ...input.moves]
        }
        return _inputs;
    }

    // get moves to reach selected simbol in the provided pad
    function getInput(pad, simbol, startPos){
        if(cache.has(`${pad.length}|${startPos.x}-${startPos.y}|${simbol}`)) 
            return JSON.parse(cache.get(`${pad.length}|${startPos.x}-${startPos.y}|${simbol}`));

        const simbolPos = getSimbolPos(pad, simbol);
        if(!simbolPos) return [];
        const moves = getMoves(pad, startPos, simbolPos);
        cache.set((`${pad.length}|${startPos.x}-${startPos.y}|${simbol}`), JSON.stringify({pos: simbolPos, moves: moves}));
        return {
            pos: simbolPos, 
            moves: moves
        };
    }

    // get move list from one position to another
    function getMoves(pad, startPos, simbolPos){
        let moves = [];
        const h_moves = [];
        const v_moves = [];
        let diffX = simbolPos.x - startPos.x;
        let diffY = simbolPos.y - startPos.y;

        let horiz = '>';
        let vert = '^';
        if(diffX < 0)horiz = '<';
        if(diffY > 0)vert = 'v';
        let _diffX = Math.abs(diffX);
        let _diffY = Math.abs(diffY);
        while(_diffX > 0){
            h_moves.push(horiz);
            _diffX--;
        }
        while(_diffY > 0){
            v_moves.push(vert);
            _diffY--;
        }
        
        if(diffX > 0){
            moves = [...v_moves, ...h_moves]
        } else {
            moves = [...h_moves, ...v_moves]
        }

        if(!checkPathBounds(pad, startPos, moves)){
            moves.reverse();
        }

        moves.push('A');
        return moves;
    }



    function checkPathBounds(pad, startPos, path){
        let currentPos = {
            x: startPos.x,
            y:startPos.y,
            move: function([x, y]){
                this.x += x;
                this.y += y;
            }
        };
        for(const move of path){
            currentPos.move(directions[move]);
            if(pad[currentPos.y][currentPos.x] == '.'){
                return false;
            }
        }
        return true;
    }

    // get simbol position in a particular pad
    function getSimbolPos(pad, simbol){
        let simbolPos = null;
        for(const [row_index, row] of pad.entries()){
            for(const [col_index, col] of row.entries()){
                if(col == simbol){
                    simbolPos = {
                        x: col_index,
                        y: row_index
                    }
                    break;
                }
            }
            if(simbolPos) break;
        }
        if(!simbolPos) console.log(`Simbol ${simbol} not found in provided pad!`);
        return simbolPos;
    }
}




main();