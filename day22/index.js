async function main() {
    // const data = await getData('test.txt');
    const data = await getData('input.txt');

    console.log(data);

    const secret = 123;
    let nextSecret = 123; 
    for(let i = 0; i < 10; i++){
        nextSecret = getNextSecret(nextSecret);
        console.log(nextSecret);
    }

    const startingSecrets = data.split('\r\n');
    console.log(startingSecrets);
    
    const iterations = 2000;
    let secretSum = 0;
    for(const secret of startingSecrets){
        nextSecret = secret; 
        for(let i = 0; i < iterations; i++){
            nextSecret = getNextSecret(nextSecret);
            // console.log(nextSecret);
        }
        secretSum += nextSecret;
        console.log(`${secret}: ${nextSecret}`);
    }
    console.log(`Part 1: ${secretSum}`);
    



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