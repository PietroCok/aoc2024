async function main() {
    // const data = await getData('test.txt');
    const data = await getData('input.txt');
    // const _data = await getData('input_corrected.txt');

    // console.log(data);

    const wireMap = new Map();

    class Wire {
        constructor(name, initValue = null) {
            if(wireMap.has(name)) return wireMap.get(name);
            this.name = name;
            this.value = typeof initValue == 'string' ? Number(initValue) : initValue;

            this.inputTo = [];
            this.outputOf = [];
            wireMap.set(name, this);
        }
        registerGateIn(gate){
            if(!this.inputTo.find(g => g.id == gate.id)){
                this.inputTo.push(gate);
            }
        }
        registerGateOut(gate){
            if(!this.outputOf.find(g => g.id == gate.id)){
                this.outputOf.push(gate);
            }
        }
    }

    class Gate {
        constructor(string) {
            if(!string) return;
            const elems = string.split(' ');
            let gate;

            if(string.toLowerCase().indexOf('and') >= 0){
                gate = new ANDgate();
            }

            if(string.toLowerCase().indexOf('xor') >= 0){
                gate = new XORgate();
            }

            if(!gate && string.toLowerCase().indexOf('or') >= 0){
                gate = new ORgate();
            }

            if(!gate){
                delete this;
                return;
            }

            gate.id = Math.random().toString(36).slice(2);

            gate.inputWire1 = getWire(elems[0]);
            gate.inputWire2 = getWire(elems[2]);
            gate.outputWire = getWire(elems[4]);
            gate.activated = false;

            gate.inputWire1.registerGateIn(gate);
            gate.inputWire2.registerGateIn(gate);
            gate.outputWire.registerGateOut(gate);

            return gate;
        }

        activate() {
            throw new Error("Method 'activate()' must be implemented!");
        }
    }

    class ANDgate extends Gate {
        constructor() {
            super();
        }

        activate() {
            if (!this.activated && this.inputWire1.value != null && this.inputWire2.value != null) {
                this.outputWire.value = this.inputWire1.value & this.inputWire2.value;
                this.activated = true;
            }
        }
    }

    class XORgate extends Gate {
        constructor() {
            super();
        }

        activate() {
            if (!this.activated && this.inputWire1.value != null && this.inputWire2.value != null) {
                this.outputWire.value = this.inputWire1.value ^ this.inputWire2.value;
                this.activated = true;
            }
        }
    }

    class ORgate extends Gate {
        constructor() {
            super();
        }

        activate() {
            if (!this.activated && this.inputWire1.value != null && this.inputWire2.value != null) {
                this.outputWire.value = this.inputWire1.value | this.inputWire2.value;
                this.activated = true;
            }
        }
    }

    const splitted = data.split('\r\n\r\n');
    const inputWires = splitted[0].split('\r\n').map(w => new Wire(...w.split(': ')));

    // console.log(wireMap);

    const circuit = loadCircuit(splitted[1]);

    // console.log(circuit);

    const ZoutputWires = circuit.outputWires.filter(w => w.name.startsWith('z'));
    // console.log(...ZoutputWires);
    
    while(!isOutputStable(circuit.outputWires)){
        for(const gate of circuit.gates){
            gate.activate();
        }
        // console.log(...circuit.outputWires);
        // console.log(...ZoutputWires);
    }

    // order significant output wires
    ZoutputWires.sort((a, b) => {
        if(b.name < a.name) return -1;
        return 1;
    });

    const bits = [];
    for(const wire of ZoutputWires){
        bits.push(wire.value);
        // console.log(wire.name, wire.value);
    }

    const number = Number('0b' + bits.join(''));
    console.log(`Part 1: output value is ${number} (${bits.join('')})`);
    
    // part 2 solution
    // identify wrong outputs bits (we know the circuit is a full adder so we expect the output to be the sum of inputs)
    // find the gates that should compose the full adder for the wrong output bit
    // check inputs ( in particular the carry bit, to exclude swapping on previous full adder )

    console.log(wireMap);
    for(let i = 1; i < 45; i++){
        //getFullAdder(''+i);
    }
    
    // solved "by hand" with the help of below function
    // the function finds the error but does not know which wires are wrong
    // 'tst','z05','sps', 'z11','z23','frt','pmd', 'cgh'


    function getFullAdder(bitIndex){
        const x = wireMap.get('x' + bitIndex.padStart(2, '0'));
        const y = wireMap.get('y' + bitIndex.padStart(2, '0'));
        const z = wireMap.get('z' + bitIndex.padStart(2, '0'));
        const XOR_in = getGateFromInputWire(x, 'XORgate');
        let carry_in = -1;
        let carry_out = -1;
        const AND_carry = getGateFromInputWire(XOR_in.outputWire, 'ANDgate');
        if(AND_carry){
            carry_in = AND_carry.inputWire1.name == XOR_in.outputWire.name ? AND_carry.inputWire2 : AND_carry.inputWire1;
        }

        let XOR_out;
        const XOR_out_inner = getGateFromInputWire(XOR_in.outputWire, 'XORgate');
        const XOR_out_z = getGateFromOutputWire(z, 'XORgate');
        if(!XOR_out_inner){
            console.log('Error on wire: ', XOR_in.outputWire);
            XOR_out = XOR_out_z;
        }
        if(!XOR_out_z){
            console.log('Error on wire: ', z);
        }
        if(XOR_out_inner && XOR_out_z && XOR_out_inner.id != XOR_out_z.id){
            console.log('Error on gates: ', XOR_out_inner, XOR_out_z);
        }
        

        let AND_sum;
        let AND_sum_x = getGateFromInputWire(x, 'ANDgate');
        let AND_sum_y = getGateFromInputWire(y, 'ANDgate');
        if(!AND_sum_x){
            console.log('Error on wire: ', x);
        }
        if(!AND_sum_y){
            console.log('Error on wire: ', y);
        }
        if(AND_sum_x && AND_sum_y){
            if(AND_sum_x.id != AND_sum_y.id){
                console.log('Error on AND_sum for wires: ', x, y);
            } else {
                AND_sum = AND_sum_x;
            }
        }

        const OR = getGateFromInputWire(AND_carry.outputWire, 'ORgate');
        if(!OR){
            console.log('Error on wire: ', AND_carry.outputWire);
        }
        // check if found OR gate is the correct one
        // must be the same of the exit wire from the ANDS
        const AND_sum_OR = getGateFromInputWire(AND_sum.outputWire, 'ORgate');
        if(!AND_sum_OR){
            console.log('Error on wire: ', AND_sum.outputWire);
        }
        if(OR && AND_sum_OR && OR.id != AND_sum_OR.id){
            console.log('Output of gate: ', OR ,' is wrongly connected!');
        }
        carry_out = OR.outputWire;
        
        // console.log('\nx:', x, '\ny:', y, '\nz:', z, '\nc_in:', carry_in, '\nc_out:', carry_out);
        // check if result of adder is correct
        if(checkFullAdderResult(x, y, carry_in, z, carry_out)){
            //console.log('Full adder is correcty wired!');
            return true;
        } else {
            console.log('Full adder is NOT correcty wired!', bitIndex, x, y, carry_in, z, carry_out);
            return false;
        }
    }

    function checkFullAdderResult(x, y, c_in = {value: 0}, z, c_out = {value:0}){
        const _x = x.value;
        const _y = y.value;
        const _c_in = c_in.value >= 0 ? c_in.value : 0;
        const _z = _x ^ _y ^ _c_in;
        const _c_out = ((_x ^ _y) & _c_in) | (_x & _y);
        if(z.value != _z || c_out.value != _c_out){
            return false;
        }
        return true;
    }


    function getGateFromOutputWire(outputWire, gateType){
        for(const gate of outputWire.outputOf){
            if(gate.constructor.name == gateType){
                return gate;
            }
        }
        return null;
    }

    function getGateFromInputWire(inputWire, gateType){
        for(const gate of inputWire.inputTo){
            if(gate.constructor.name == gateType){
                return gate;
            }
        }
        return null;
    }

    // functions
    function isOutputStable(wires){
        for(const wire of wires){
            if(wire.value == null) return false;
        }

        return true;
    }

    function loadCircuit(_data){
        const gates = [];
        const outputWires = [];
        let inputs = _data.split('\r\n');

        for(const input of inputs){
            let elems = input.split(' -> ');
            outputWires.push(new Wire(elems[1]));
            gates.push(new Gate(input));
        }

        return {
            gates: gates,
            outputWires: outputWires
        }        
    }

    function getWire(wireName){
        return new Wire(wireName);
    }
}




main();