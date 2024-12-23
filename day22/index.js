async function main() {
    // const data = await getData('test.txt');
    const data = await getData('input.txt');

    // console.log(data);

    const secret = 123;
    let nextSecret = 123; 
    for(let i = 0; i < 10; i++){
        nextSecret = getNextSecret(nextSecret);
    }

    const startingSecrets = data.split('\r\n');
  
    // Part 1
    const iterations = 2000;
    let secretSum = 0;
    let startTime = performance.now()
    for(const secret of startingSecrets){
        nextSecret = secret; 
        for(let i = 0; i < iterations; i++){
            nextSecret = getNextSecret(nextSecret);
        }
        secretSum += nextSecret;
    }
    console.log(`Part 1: ${secretSum} - time: ${(performance.now() - startTime).toFixed(1)} ms`);
    

    // Part 2
    const posSequences = {};
    const allSequences = new Set();
    let _sequence = [];
    let prevSecret;
    startTime = performance.now()
    for(const [index, secret] of startingSecrets.entries()){
        nextSecret = prevSecret = secret;
        posSequences[secret] = {}
        for(let i = 0; i < iterations; i++){
            nextSecret = getNextSecret(nextSecret);
            let currentPrice = getPrice(prevSecret);
            if(_sequence.length == 4){
                const _seqStr = _sequence.join(',');
                allSequences.add(`${_seqStr}`);
                // keep only first occurence of sequence for each buyers 
                if(!posSequences[secret][_seqStr]){
                    posSequences[secret][_seqStr] = currentPrice
                }
            }

            // keep track of price difference and current Price
            let priceDiff = getPriceDiff(prevSecret, nextSecret)
            // add to current sequence and rotate if > 4
            _sequence.push(priceDiff);
            if(_sequence.length > 4){
                _sequence.shift();
            }            
            prevSecret = nextSecret;
        }
    }

    // count each sequence total result => keep track of highest
    let highestbananas = 0;
    let highestSequence = [];
    for(const sequence of allSequences){
        let bananas = 0;
        for(const secret of startingSecrets){
            if(posSequences[secret][sequence]){
                bananas += posSequences[secret][sequence]
            }
        }
        if(bananas > highestbananas){
            highestbananas = bananas;
            highestSequence = sequence;
            console.log(`New best sequence found: ${highestbananas}`);
        }
    }
    
    console.log(`Part 2: Total bananas aquired is: ${highestbananas}`);
    console.log('Price seguence that earn most bananas is: ', highestSequence);
    
    
    // 974 => low
    

    function getPriceDiff(prevSecret, currentSecret){
        // price is least significant digit of the secret
        let prevPrice = getPrice(prevSecret);
        let currentPrice = getPrice(currentSecret);
        return currentPrice - prevPrice;
    }

    function getPrice(secret){
        const regex = new RegExp(/\d$/);
        return Number(secret.toString().match(regex)[0])
    }

    function getNextSecret(prevSecret){
        let nextSecret = prevSecret;
        let step_1 = nextSecret << 6;       // * 64
        nextSecret = mix(step_1, nextSecret);
        nextSecret = prune(nextSecret);

        let step_2 = nextSecret >> 5;       // / 32
        nextSecret = mix(step_2, nextSecret);
        nextSecret = prune(nextSecret);

        let step_3 = nextSecret << 11;      // * 2048
        nextSecret = mix(step_3, nextSecret);
        nextSecret = prune(nextSecret);

        return nextSecret;
    }

    function mix(prevSecret, nextSecret){
        return prevSecret ^ nextSecret;     // bit XOR
    }

    function prune(secret){
        return secret & 0XFFFFFF;           // % 16777216
    }   

}




main();