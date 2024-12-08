async function main() {
    // const data = await getData('input_test.txt');
    const data = await getData('input.txt');
    // const data = await getData('input_custom.txt');

    console.log(data);

    const parsed = data.split('\r\n').map( x => x.split(''));

    console.log(parsed[0].length);
    

    // ricerca antenne
    const freqs = {};
    for(let [y, line] of parsed.entries()){
        for(let [x, col] of line.entries()){
            if(col != '.'){               
                if(!freqs[col]){
                    freqs[col] = [];
                }
                freqs[col].push({
                    x: x,
                    y: y
                });
            }
        }
    }
    console.log(freqs);

    // a coppie di antenne con la stessa frequenza ricavo gli antinodi

    for(let freq of Object.keys(freqs)){

        // single frequency
        for(let i = 0; i < freqs[freq].length; i++){
            let pos1 = freqs[freq][i];
            
            for(let j = 0; j < freqs[freq].length; j++){
                let pos2 = freqs[freq][j];

                if(i != j){

                    let diffX = pos1.x - pos2.x;
                    let diffY = pos1.y - pos2.y;

                    // aggiungi la distanza alla seconda posizione per trovare l'antinodo
                    let antX = pos1.x + diffX;
                    let antY = pos1.y + diffY;

                    while(true){    // added for part 2 solution
                        // antinode outside of map
                        if(antX < 0 || antX > parsed[0].length - 1){
                            break;
                        }
                        if(antY < 0 || antY > parsed.length - 1){
                            break;
                        }
    
                        console.log('Antinode found in position: ', antX, antY);
                        
                        parsed[antY][antX] = '#';


                        antX += diffX;  // added for part 2 solution
                        antY += diffY;  // added for part 2 solution
                    }
                }
            }
        }
    }

    console.log(parsed.map(x => x.join('')).join('\r\n'));
    
    // count antinodes
    let count = 0;
    for(let y of parsed){
        for(let x of y){
            // if(x == '#)  // part 1 solution
            if(x != '.'){
                count++;
            }            
        }
    }

    console.log(count);
    

}


main();