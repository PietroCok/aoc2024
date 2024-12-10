async function main() {
    // const data = await getData('input_test.txt');
    const data = await getData('input.txt');
    // const data = await getData('input_custom.txt');


    console.log(data);
    // parse

    const parsed = data.split('\r\n').map(l => {

        return {
            og: l,
            values: l.split(':')[1].split(" ").filter(o => o != '').map(o => Number(o)),
            res: Number(l.split(':')[0]),
            isValid: false
        }
    });

    //console.log('Parsed: ', parsed);

    for (let [index, eq] of parsed.entries()) {
        findOperators(eq);
        console.log(`Expression (${index+1}/${parsed.length}) : ${eq.og} => %c${eq.isValid}`, `color:${eq.isValid ? 'lime' : 'red'}`);
    }

    let valid = parsed.filter( e => e.isValid);

    //console.log(valid);
    console.log('Result: ' + valid.reduce((sum, eq) => sum + eq.res, 0));
}

function findOperators(eq) {

    const ops = generateOperandCombinations(eq.values.length - 1);
    
    // its gets really slow for very large number of values in the equation
    let comb = []; // array con espressione completa di operatori
    for (let op of ops) {
        comb = [];
        for (let i = 0; i < eq.values.length; i++) {
            comb.push(eq.values[i]);
            if (op[i]) {
                comb.push(op[i]);
            }
        }
        let expr = comb;
        let res = evalExpr(expr, eq.res);
        if (res == eq.res) {
            eq.isValid = true;
            return;
        }
    }
}

function evalExpr(expr, exp_res){
    // evaluate expr left to right
    let op = null;
    let res = null;
    for(let i of expr){
        if(availableOps.includes(i)){
            // trovato operatore
            op = i;
        } else {
            if(op){
                if(op == '||'){
                    // merge values
                    res = Number(res.toString().concat(i));
                } else {
                    // devo eseguire un'operazione
                    //res = eval(res + op + i)
                    if(op == '+'){
                        res += i;
                    } else if(op == '*'){
                        res *= i;
                    }
                }
            } else {
                // nessuna operazione = primo numero
                res = i;
            }
        }
        // exit if larger than expected
        if(res > exp_res){
            return res;
        }
    }
    return res;
}

function generateOperandCombinations(length) {
    const result = [];
    function helper(prefix, depth) {
        if (depth === length) {
            result.push(prefix);
            return;
        }
        for (const operand of availableOps) {
            helper([...prefix, operand], depth + 1);
        }
    }
    helper([], 0);
    return result;
}

//console.log(`%c${data}`, 'color:lime')

// part 1 ops
//const availableOps = ['+', '*'];
// part 2 ops
const availableOps = ['+', '*', '||'];

main();