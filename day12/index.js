async function main() {
    // const data = await getData('input_test.txt');
    const data = await getData('input.txt');

    console.log(data);

    const garden = data.split('\r\n').map(p => p.split(''));

    console.log(garden);

    // keep track of checked cell
    const alreadyChecked = new Set();
    // keep track of current plot
    let plot;
    const adiacentCoords = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
    ]


    isolatePlots();
    

    function isolatePlots() {
        let perimeter = 0;
        let area = 0;
        let totalPrice = 0;
        
        for(const [row_i, row] of garden.entries()){
            for(const [col_i, col] of row.entries()){
                plot = new Map();
                explore(row_i, col_i, garden[row_i][col_i]);
                if(plot.size > 0){
                    console.log(garden[row_i][col_i], plot);
                    area = plot.size;
                    perimeter = plot.values().reduce((sum, freeSide) => sum + freeSide, 0)
                    
                    totalPrice += area * perimeter;
                }
            }
        }
        console.log(totalPrice);
    }

    function explore(row, col, value){
        if(plot.has(row+'|'+col)){
            return;
        }

        if(alreadyChecked.has(row+'|'+col)){
            return;
        }

        alreadyChecked.add(row+'|'+col);
        
        let freeSide = 4;
        for(const [y, x] of adiacentCoords){
            if( row+y >= 0 && row+y < garden.length && col+x >= 0 && col+x < garden[row+y].length){
                const _value = garden[row+y][col+x];
                
                if(_value == value){
                    explore(row+y, col+x, _value);
                    freeSide--;
                }
            }
        }
        plot.set(row+'|'+col, freeSide);

        return;
    }
}





main();