async function main() {
    // const data = await getData('test.txt');
    const data = await getData('input.txt');

    // console.log(data);

    const wireMap = new Map();

    class Wire {
        constructor(name, initValue = null) {
            if(wireMap.has(name)) return wireMap.get(name);
            this.name = name;
            this.value = typeof initValue == 'string' ? Number(initValue) : initValue;
            wireMap.set(name, this);
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

            gate.inputWire1 = getWire(elems[0]);
            gate.inputWire2 = getWire(elems[2]);
            gate.outputWire = getWire(elems[4]);
            gate.activated = false;

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