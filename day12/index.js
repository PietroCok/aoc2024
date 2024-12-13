async function main() {
    const data = await getData('input_test.txt');
    // const data = await getData('input.txt');

    // console.log(data);

    const garden = data.split('\r\n').map(p => p.split(''));

    // console.log(garden);

    // keep track of checked cell
    const alreadyChecked = new Set();
    // keep track of current plot
    let plot;
    let plots = []; 
    const adiacentCoords = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
    ]

    const cornersCoords = [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1]
    ]

    const mask = new Array(3);
    for(let i = 0; i < mask.length; i++){
        mask[i] = (new Array(3)).fill('.');
    }
    mask[1][1] = 'O';

    isolatePlots();

    function isolatePlots() {
        let perimeter = 0;
        let sides = 0;
        let area = 0;
        let price_1 = 0, price_2 = 0;
        
        for(const [row_i, row] of garden.entries()){
            for(const [col_i, col] of row.entries()){
                plot = new Map();
                explore(row_i, col_i, garden[row_i][col_i]);
                if(plot.size > 0){
                    area = plot.size;
                    perimeter = plot.size == 1 ? 4 : plot.values().reduce((sum, freeSide) => sum + freeSide[0], 0);
                    sides = plot.size == 1 ? 4 : plot.values().reduce((sum, freeSide) => sum + freeSide[1], 0);
                    
                    price_1 += area * perimeter;

                    price_2 += area * sides;
                    console.log(`Sides: ${sides}`);
                    viewPlot(plot);
                    console.log('\n');       

                    plots.push(plot);
                }
            }
        }
        console.log(`Part 1 price: ${price_1}`);
        console.log(`Part 2 price: ${price_2}`);
    }

    function explore(row, col, value){
        let _mask = JSON.parse(JSON.stringify(mask));
        if(plot.has(row+'|'+col)){
            return;
        }

        if(alreadyChecked.has(row+'|'+col)){
            return;
        }

        alreadyChecked.add(row+'|'+col);
        
        let freeSides = 4;
        for(const [y, x] of adiacentCoords){
            if( row+y >= 0 && row+y < garden.length && col+x >= 0 && col+x < garden[row+y].length){
                const _value = garden[row+y][col+x];
                
                if(_value == value){
                    explore(row+y, col+x, _value);
                    _mask[y+1][x+1] = 'X';
                    freeSides--;
                }
            }
        }

        for(const [y, x] of cornersCoords){
            if( row+y >= 0 && row+y < garden.length && col+x >= 0 && col+x < garden[row+y].length){
                const _value = garden[row+y][col+x];
                if(_value == value){
                    // check if it's connected to curren cell to exlude following case
                    // ..X
                    // XO.
                    // XX.
                    // -1,+1 -> -1,0 0,+1 

                    // X..
                    // .OX
                    // .XX
                    // -1,-1 -> -1,0 0,-1 

                    // .XX
                    // .OX
                    // X..
                    // +1,-1 -> +1,0 0,-1 

                    // XX.
                    // XO.
                    // ..X
                    // +1,+1 -> +1,0 0,+1 

                    // here adiacent cell are already marked
                    if(_mask[y+1][1] == 'X' || _mask[1][x+1] == 'X'){
                        _mask[y+1][x+1] = 'X';
                    } else {
                        // mark different zone for easier understanding
                        _mask[y+1][x+1] = 'Z';
                    }
                }
            }
        }

        // 0-0 0-1 0-2
        // 1-0 1-1 1-2
        // 2-0 2-1 2-2
        let corners = 0;
        if(_mask[0][0] != 'X' && _mask[0][1] == _mask[1][0]) corners++;
        if(_mask[0][2] != 'X' && _mask[0][1] == _mask[1][2]) corners++;
        if(_mask[2][2] != 'X' && _mask[2][1] == _mask[1][2]) corners++;
        if(_mask[2][0] != 'X' && _mask[2][1] == _mask[1][0]) corners++;
        console.log(_mask.map(e => e.join('')).join('\r\n'), corners);
        
        plot.set(row+'|'+col, [freeSides, corners]);

        return;
    }
}

function viewPlot(plot){
    const coords = (Array.from(plot.keys())).map(e => e.split('|'));

    const width = Math.max(...coords.map(e => e[1])) + 1;
    const height = Math.max(...coords.map(e => e[0])) + 1;
    
    const map = new Array(height);
    for(let i = 0; i < height; i++){
        map[i] = new Array(width).fill('-')
    }

    for(let i = 0; i < coords.length; i++){
        map[coords[i][0]][coords[i][1]] = plot.get(coords[i][0]+'|'+coords[i][1])[1];
    }

    console.log(map.map(e => e.join('')).join('\r\n'));
}

main();