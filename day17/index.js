async function main() {
    // const data = await getData('test.txt');
    const data = await getData('input.txt');

    console.log(data);


    class Processor{
        constructor(){
            this.A = 0;
            this.B = 0;
            this.C = 0;

            this.program = [];
            this.outputBuffer = [];
            this.instructionPointer = 0;

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
                0: 0,
                1: 1,
                2: 2,
                3: 3,
                4: 'A',
                5: 'B',
                6: 'C'
            }
        }

        init(input){
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
            console.log(this.outputBuffer.join(','));
        }

        getOperand(value){
            if(typeof this.operands[value] == 'string'){
                return this[this.operands[value]];
            } else {
                return this.operands[value];
            }
        }
        // instructions
        adv(operand){
            const value = this.getOperand(operand);
            this.A = this.div(value);
        }

        bxl(operand){
            this.B = this.B ^ operand;
        }

        bst(operand){
            this.B = this.getOperand(operand) % 8
        }

        jnz(operand){
            console.log(this.A);
            
            if(this.A == 0) return;
            this.instructionPointer = operand;
        }

        bxc(operand){
            this.B = this.B ^ this.C;
        }

        out(operand){
            const value = this.getOperand(operand) % 8;
            this.outputBuffer.push(value);
        }

        bdv(operand){
            const value = this.getOperand(operand);
            this.B = this.div(value);
        }

        cdv(operand){
            const value = this.getOperand(operand);
            this.C = this.div(value);
        }

        div(power){
            const result = Math.floor(this.A / (Math.pow(2, power)))
            return result;
        }

    }

    // Part 1
    const procressor = new Processor();
    procressor.init(data);
    console.log(procressor);
    procressor.execProgram();


    // Part 2
    
}

main();