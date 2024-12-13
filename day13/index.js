async function main() {
    // const data = await getData('input_test.txt');
    const data = await getData('input.txt');

    let _data = data.split('\r\n\r\n');
    const inputs = [];
    let tokens_1 = 0;
    let tokens_2 = 0;

    // parse
    for(const input of _data){
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
    
    for(let [index, input] of inputs.entries()){
        // part 1
        let _tokens;
        _tokens = getCheapest_1(input);
        tokens_1 += _tokens;

        // part 2
        // input.target.x += 10_000_000_000_000;
        // input.target.y += 10_000_000_000_000;
        _tokens = getCheapest_2(input);
        tokens_2 += _tokens;
        console.log(`Calculated input ${index+1}/${inputs.length}`);
    }

    console.log(`Tokens (part 1): ${tokens_1}`);
    console.log(`Tokens (part 2): ${tokens_2}`);
    // p2
    // 92804615715615 => too high
    // 92804585035475
    // 92801517033164 => too high
    //
    

    function getCheapest_1(input){
        // n, m are integers
        // m, m are presses for each button
        // target.x = input.A.x * n + input.B.x * m
        // target.y = input.A.y * n + input.B.y * m
        // n <= 100
        // m <= 100
        const solutions = [];
        for(let i = 0; i < 100; i++){
            for(let j = 0; j < 100; j++){
                _x = input.A.x * i + input.B.x * j;
                _y = input.A.y * i + input.B.y * j;
                if(input.target.x == _x && input.target.y == _y){
                    solutions.push((i * 3) + j);
                }
            }
        }
        
        //console.log(`Solutions: `, solutions);
        return Math.min(solutions);
    }

    function getCheapest_2(input){
        let solution = null;

        return solution;
    }
}




main();