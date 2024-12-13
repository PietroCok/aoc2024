async function main() {
    // const data = await getData('input_test.txt');
    const data = await getData('input.txt');

    let _data = data.split('\r\n\r\n');
    const inputs = [];
    let tokens_1 = 0;
    let tokens_2 = 0;

    // parse
    for (const input of _data) {
        let lines = input.split('\r\n')
        let button_A = lines[0].split(': ')[1].split(', ');
        let button_B = lines[1].split(': ')[1].split(', ');
        let target = lines[2].split(': ')[1].split(', ');

        let config = {
            A: {
                x: Number(button_A[0].slice(1)),
                y: Number(button_A[1].slice(1))
            },
            B: {
                x: Number(button_B[0].slice(1)),
                y: Number(button_B[1].slice(1))
            },
            target: {
                x: Number(target[0].slice(2)),
                y: Number(target[1].slice(2))
            }
        }
        inputs.push(config);
    }

    console.log(inputs);

    for (let [index, input] of inputs.entries()) {
        // part 1
        let _tokens_1, _tokens_2;
        _tokens_1 = getCheapest(input);
        tokens_1 += _tokens_1;

        // part 2
        input.target.x += 10_000_000_000_000;
        input.target.y += 10_000_000_000_000;
        _tokens_2 = getCheapest(input);
        tokens_2 += _tokens_2;
        console.log(`Calculated input ${index + 1}/${inputs.length} => ${_tokens_1} | ${_tokens_2}`);
    }

    console.log(`Tokens (part 1): ${tokens_1}`);
    console.log(`Tokens (part 2): ${tokens_2}`);

    function getCheapest(input) {
        function solve(a1, b1, c1, a2, b2, c2) {
            const det = a1*b2 - a2*b1;
            if (det === 0) {
              return 0;
            }
           
            const x = (c1*b2 - c2*b1) / det;
            const y = (a1*c2 - a2*c1) / det;
            
            if(x == Math.floor(x) && y == Math.floor(y)){
                return x*3 + y;
            }
            return 0;
        }
        
        return solve(input.A.x, input.B.x, input.target.x, input.A.y, input.B.y, input.target.y);
    }
}




main();