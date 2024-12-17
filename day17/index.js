async function main() {
    // const data = await getData('test.txt');
    const data = await getData('input.txt');

    console.log(data);


    class Processor{
        constructor(){
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

        init(input){
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

        loadRegs(a, b, c){
            this.A = Number(a || this.A);
            this.B = Number(b || this.B);
            this.C = Number(c || this.C);
        }

        loadProgram(string){
            this.program = string.split(',').map(o => Number(o))
        }

        execProgram(){
            while(this.instructionPointer < this.program.length - 1){
                const instruction = this.program[this.instructionPointer];
                this.instructionPointer++;
                const operand = this.program[this.instructionPointer];
                this.instructionPointer++;
                // console.log(`Executing: ${instruction}(${operand})`);
                this.opCodes[instruction].bind(this)(operand);
            }
            this.printOutput();
        }

        printOutput(){
            console.log(`Output (${this.outputBuffer.length}): ${this.outputBuffer.join(',')}`);
        }

        fixRegisterA(data){
            this.init(data);
        }

        getOperand(value){
            if(typeof this.operands[value] == 'string'){
                return this[this.operands[value]];
            } else {
                return this.operands[value];
            }
        }
        // instructions
        // 0
        adv(operand){
            const value = this.getOperand(operand);
            this.A = this.div(value);
        }

        // 1
        bxl(operand){
            this.B = BigInt(this.B) ^ BigInt(operand);
        }

        // 2
        bst(operand){
            this.B = BigInt(this.getOperand(operand)) % BigInt(8);
        }

        // 3
        jnz(operand){
            if(this.A == BigInt(0)) return;
            this.instructionPointer = operand;
        }

        // 4
        bxc(operand){
            this.B = this.B ^ this.C;
        }

        // 5
        out(operand){
            const value = BigInt(this.getOperand(operand)) % BigInt(8);
            this.outputBuffer.push(value);
        }

        // 6
        bdv(operand){
            const value = this.getOperand(operand);
            this.B = this.div(value);
        }

        // 7
        cdv(operand){
            const value = this.getOperand(operand);
            this.C = this.div(value);
        }

        div(power){
            const result = BigInt(this.A) >> BigInt(power);
            return result;
        }

    }

    // Part 1
    const processor = new Processor();
    processor.init(data);
    processor.execProgram();


    // Part 2
    processor.fixRegisterA(data);

    window.addEventListener('keypress', (evt) => {
        if(evt.key == 'Enter'){
            processor.init(data);
            processor.A = BigInt(document.querySelector('input').value);
            console.log(`Running program with register A set to: ${processor.A}`);
            processor.execProgram();
        }
    })
}

//  35_184_372_088_832 min -> less has not enough digits
// 281_474_976_710_655 max -> more has too many digits

main();