async function main() {
    // const data = await getData('input_test.txt');
    const data = await getData('input.txt');

    
    let stones = data.split(' ')
    console.log(stones);

    const blinkTimes = 75;
    let startTime;

    let total_stones = 0;
    startTime = performance.now();
    for(let i = 0; i < stones.length; i++){
        console.log(`Blinking stone ${stones[i]}  ${blinkTimes} times`);
        total_stones += allBlinks(stones[i], blinkTimes, 0);
    }
    console.log(`Blinks: ${blinkTimes} - final stones: ${total_stones} | time: ${(performance.now() - startTime).toFixed(0)} ms`);
    
}

// map stone value with remaining blink and stone produced
const blinkCache = new Map();

function allBlinks(stone, blinks){
    // no blink needed
    if(blinks <= 0) return 1;
    // last blink, i dont care about saving stone values
    if(blinks == 1){
        if((''+stone).length % 2 == 0){
            return 2;
        } else {
            return 1;
        }
    }
    
    let stones = [stone];
    let otherStones = 0;
    let _stones = 0;
    let cacheKey = '';
    for(let i = 0; i < blinks; i++){
        let remaining_blinks = blinks - i - 1;
        
        for(let index = 0; index < stones.length; index++){

            let length = (''+stones[index]).length;
            
            if(stones[index] == 0){
                // rule: 0 => 1
                stones[index] = 1;
            } else if(length % 2 == 0){
                
                
                let left = Number((''+stones[index]).slice(0, length/2));
                let right = Number((''+stones[index]).slice(length/2));
                
                // rule: '0000' => 0
                left = left == 0 ? 0 : left;
                right = right == 0 ? 0 : right;
                
                stones[index] = left;
                
                cacheKey = right + '|' + (remaining_blinks);
                if(blinkCache.has(cacheKey)){
                    _stones = blinkCache.get(cacheKey);
                    otherStones += _stones;
                    continue;
                }
                
                _stones = allBlinks(right, remaining_blinks);
                otherStones += _stones;

                blinkCache.set(cacheKey, _stones);
                
            } else {
                // rule: any => value * 2024
                stones[index] *= 2024;
            }
        }
    }
    
    return stones.length + otherStones;
}


main();