async function main() {
    // const data = await getData('test.txt');
    const data = await getData('input.txt');

    console.log(data);


    class Processor {
        constructor() {
            this.opCodes = {
                0: this.adv,
                1: this.bxl,
                2: this.bst,
                3: this.jnz,
                4: this.bxc,
                5: this.out,
                6: this.bdv,
                7: this.cdv
            }
            this.operands = {
                0: BigInt(0),
                1: BigInt(1),
                2: BigInt(2),
                3: BigInt(3),
                4: 'A',
                5: 'B',
                6: 'C'
            }
        }

        init(input) {
            this.program = [];
            this.outputBuffer = [];
            this.instructionPointer = 0;

            this.A = BigInt(0);
            this.B = BigInt(0);
            this.C = BigInt(0);

            let regs = input.split('\r\n\r\n')[0];
            let prog = input.split('\r\n\r\n')[1].split(': ')[1];

            let a = regs.split('\r\n')[0].split(': ')[1];
            let b = regs.split('\r\n')[1].split(': ')[1];
            let c = regs.split('\r\n')[2].split(': ')[1];

            this.loadRegs(a, b, c)
            this.loadProgram(prog);
        }

        loadRegs(a, b, c) {
            this.A = Number(a || this.A);
            this.B = Number(b || this.B);
            this.C = Number(c || this.C);
        }

        loadProgram(string) {
            this.program = string.split(',').map(o => Number(o));
            
            this.showProgram();
        }

        showProgram(){
            // show the actual commands 

            const div = document.querySelector('#code');
            div.innerHTML = '';

            for(let i = 0; i < this.program.length; i += 2){
                let li = document.createElement('li');
                let text = document.createTextNode(`${this.opCodes[this.program[i]].name} ${this.operands[this.program[i+1]]}`);
                li.appendChild(text)
                div.appendChild(li);
            }
        }

        execProgram() {
            while (this.instructionPointer < this.program.length - 1) {
                const instruction = this.program[this.instructionPointer];
                this.instructionPointer++;
                const operand = this.program[this.instructionPointer];
                this.instructionPointer++;
                // console.log(`Executing: ${instruction}(${operand})`);
                this.opCodes[instruction].bind(this)(operand);
            }

            console.log(`Program (16): ${this.program}`)
            this.printOutput();
        }

        printOutput() {
            console.log(`Output  (${this.outputBuffer.length}): ${this.outputBuffer.join(',')}`);
        }

        fixRegisterA(data) {
            const start = 202975183831040;
            const end = 202975183835721;
            for(let i = start; i <= end; i++){
                this.init(data);
                this.A = i;
                this.execProgram();
                
                if(this.program.length == this.outputBuffer.length){
                    let same = true;
                    for(const [index, instruction] of this.program.entries()){
                        if(instruction != this.outputBuffer[index]){
                            same = false;
                            break;
                        }
                    }

                    if(same){
                        console.log(`Initial value for A found: ${i}`);
                        return;
                    }
                }
            }
            console.log('ops');
            
        }

        getOperand(value) {
            if (typeof this.operands[value] == 'string') {
                return this[this.operands[value]];
            } else {
                return this.operands[value];
            }
        }
        // instructions
        // 0
        adv(operand) {
            const value = this.getOperand(operand);
            this.A = this.shift(value);
        }

        // 1
        bxl(operand) {
            this.B = BigInt(this.B) ^ BigInt(operand);
        }

        // 2
        bst(operand) {
            this.B = BigInt(this.getOperand(operand)) & BigInt(7);
        }

        // 3
        jnz(operand) {
            if (this.A == BigInt(0)) return;
            this.instructionPointer = operand;
        }

        // 4
        bxc(operand) {
            this.B = this.B ^ this.C;
        }

        // 5
        out(operand) {
            const value = BigInt(this.getOperand(operand)) & BigInt(7);
            this.outputBuffer.push(value);
        }

        // 6
        bdv(operand) {
            const value = this.getOperand(operand);
            this.B = this.shift(value);
        }

        // 7
        cdv(operand) {
            const value = this.getOperand(operand);
            this.C = this.shift(value);
        }

        shift(n) {
            const result = BigInt(this.A) >> BigInt(n);
            return result;
        }

    }

    // Part 1
    const processor = new Processor();
    processor.init(data);
    processor.execProgram();


    // Part 2
    // processor.fixRegisterA(data);

    window.addEventListener('keypress', (evt) => {
        if (evt.key == 'Enter') {
            processor.init(data);
            processor.A = BigInt(document.querySelector('#base_10').value);
            console.log(`Running program with register A set to: ${processor.A}`);
            processor.execProgram();
        }
    })


    // some interaction
    // can input values in either base 10 or base 8 (and corrisponding value in the other base is shown)
    const base_10_input = document.querySelector('#base_10');
    const base_8_input = document.querySelector('#base_8');
    const base_2_input = document.querySelector('#base_2');

    base_8_input.addEventListener('keyup', () => updateValues('8'))
    base_10_input.addEventListener('keyup', () => updateValues('10'))
    base_2_input.addEventListener('keyup', () => updateValues('2'))

    function updateValues(from) {
        switch (from) {
            case '10':
                base_8_input.value = (Number(base_10_input.value)).toString(8);
                base_2_input.value = (Number(base_10_input.value)).toString(2);
                break;
            case '8':
                base_10_input.value = parseInt(('0' + base_8_input.value), 8);
                base_2_input.value = parseInt(('0' + base_8_input.value), 8).toString(2);
                break;
            case '2':
                base_10_input.value = parseInt(base_2_input.value, 2);
                base_8_input.value = parseInt(base_2_input.value, 2).toString(8);
                break;
            
        }
    }


}

// min/max values of register A

// base 10
//  35_184_372_088_832
// 281_474_976_710_655

// base 8 (16 digits)
// 1_000_000_000_000_000
// 7_777_777_777_777_777

// base 2 (48 bit)
//   1000000000000000000000000000000000000000000000
// 111111111111111111111111111111111111111111111111


// 1_110_000_000_000_000_000_000_000_000_000_000_000_000_000_111


// 101000000000010100100100101100000010001000000111

// 5611532756610131 => 5,4,5,1,5,5,0,3,1,4,4,4,5,5,3,0

// 5611532756611111 => 5,5,5,5,5,5,0,3,1,4,4,4,5,5,3,0

// 5611532756600000

// 5611532756611111

main();