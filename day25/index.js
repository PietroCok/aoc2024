async function main() {
    // const data = await getData('test.txt');
    const data = await getData('input.txt');

    console.log(data);
    const singleObjects = data.split('\r\n\r\n').map(row => row.split('\r\n'));
    console.log(singleObjects);
    
    let maxHeight;
    const locks = singleObjects.filter(o => o[0] == '#'.repeat(o[0].length)).map(o => getPinValues(o));
    const keys = singleObjects.filter(o => o[o.length-1] == '#'.repeat(o[o.length-1].length)).map(o => getPinValues(o));
    console.log(keys, locks);

    // try every key in every lock
    let count = 0;
    for(const lock of locks){
        for(const key of keys){
            if(fit(key, lock)) {
                count++;
                continue;
            };
        }
    }

    console.log('Part 1: ', count);

    function fit(key, lock){
        for(const [index, pin] of lock.entries()){
            if(pin + key[index] > maxHeight) return false;
        }
        return true;
    }

    function getPinValues(obj){
        // returns an array where every element is the pin value
        const objValues = [];
        const objWidth = obj[0].length;
        const objHeight = obj.length;
        maxHeight = objHeight - 2;
        for(let i = 0; i < objWidth; i++){
            let pinValue = 0;
            for(let j = 0; j < objHeight; j++){
                if(obj[j].charAt(i) == '#'){
                    pinValue++;
                }
            }
            objValues.push(pinValue-1);
        }

        return objValues;
    }
    
}




main();