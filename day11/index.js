async function main() {
    // const data = await getData('input_test.txt');
    const data = await getData('input.txt');

    
    let stones = data.split(' ')
    console.log(stones);

    const blinkTimes = 30;
    let startTime;

    let total_stones = 0;
    stones = data.split(' ')
    startTime = performance.now();
    for(let i = 0; i < stones.length; i++){
        total_stones += applyAllBlinks(stones[i], blinkTimes);
    }
    console.log(`Blinks: ${blinkTimes} - stones: ${total_stones} | time: ${(performance.now() - startTime).toFixed(0)} ms`);
}

function applyAllBlinks(stone, blinks){
    let stones = [stone];
    for(let i = 0; i < blinks; i++){
        console.log(`Stone: ${stone} - blink #${i+1}`);
        for(let index = 0; index < stones.length; index++){
            let length = (''+stones[index]).length;
            if(stones[index] == 0){
                stones[index] = 1;
            } else if(length % 2 == 0){
                let left = (''+stones[index]).slice(0, length/2);
                let right = (''+stones[index]).slice(length/2);
                left = left == 0 ? 0 : left;
                right = right == 0 ? 0 : right; 
                stones[index] = right;
                stones.splice(index, 0, left);
                index++;
            } else {
                stones[index] *= 2024;
            }
        }
    }
    return stones.length;
}

main();