async function main() {
    // const data = await getData('input.txt');
    const data = await getData('input.txt');

    let field = data.split('\r\n').map(line => line.split(''));

    const field_copy = JSON.parse(JSON.stringify(field));
    
    const guard = {
        y: null,
        x: null,
        startX: null,
        startY: null,
        direction: null,
        isInField: false,
        uniquePos: new Set(),
        allPos: new Set(),
        nextCell: {x: null, y: null},
        move: function () {
            
            // choose next cell
            switch (this.direction) {
                case '^':
                    this.nextCell.x = this.x;
                    this.nextCell.y = this.y - 1;
                    break;
                case '>':
                    this.nextCell.x = this.x + 1;
                    this.nextCell.y = this.y;
                    break;
                case 'v':
                    this.nextCell.x = this.x;
                    this.nextCell.y = this.y + 1;
                    break;
                case '<':
                    this.nextCell.x = this.x - 1;
                    this.nextCell.y = this.y;
                    break;
            }

            

            // check if next cell is inside the field
            if(this.nextCell.x < 0 || this.nextCell.x > field[0].length - 1){
                return;
            }

            if(this.nextCell.y < 0 || this.nextCell.y > field[0].length - 1){
                return;
            }

            // check if next cell is free
            if(field[this.nextCell.y][this.nextCell.x] != '.'){
                this.rotate();
                this.move();
                return;
            }

            if(this.checkForLoops && this.isLoop()){
                loops++;
                return;
            }

            // actual movement
            this.addNextPos();
            field[this.nextCell.y][this.nextCell.x] = this.direction;
            field[this.y][this.x] = '.';
            this.x = this.nextCell.x;
            this.y = this.nextCell.y;


            this.move()

        },
        rotate: function() {
            // ruota la guarda in senso orario sul posto
            switch (this.direction) {
                case '^':
                    this.direction = '>';
                    break;
                case '>':
                    this.direction = 'v';
                    break;
                case 'v':
                    this.direction = '<';
                    break;
                case '<':
                    this.direction = '^';
                    break;
            }
        },
        init: function (checkForLoops) {
            // reset 
            field = JSON.parse(JSON.stringify(field_copy));
            this.allPos = new Set();
            this.uniquePos = new Set();
            this.x = null;
            this.y = null;
            this.checkForLoops = checkForLoops;

            // setup
            for (let [index_l, line] of field.entries()) {
                for (let [index_c, col] of line.entries()) {
                    if (col != '#' && col != '.') {
                        this.startX = this.x = index_c;
                        // direction
                        this.direction = col;
                        this.isInField = true;
                        break;
                    }
                }
                if (this.x) {
                    this.startY = this.y = index_l;
                    break;
                }
            }
            this.addPos();
        },
        addPos: function(){
            this.uniquePos.add(this.x + '|' + this.y);
            this.allPos.add(this.x + '|' + this.y + '|' + this.direction);
        },
        addNextPos: function(){
            this.uniquePos.add(this.nextCell.x + '|' + this.nextCell.y);
            this.allPos.add(this.nextCell.x + '|' + this.nextCell.y + '|' + this.direction);
        },
        isLoop: function(){
            // checks if current position and direction is already registered => loop
            return this.allPos.has(this.nextCell.x + '|' + this.nextCell.y + '|' + this.direction)
        }
    }

    // part 1 solution
    guard.init();
    guard.move();
    console.log('Unique positions: ', guard.uniquePos.size);
    
    
    // part 2 solution
    console.log('Bruteforcing part 2 of the puzzle, it is a really slow process!');
    let loops = 0;
    let startTime = performance.now()
    for(let [index_l, line] of field.entries()){
        for(let [index_c, col] of line.entries()){
            if(col == '.'){
                guard.init(true); // for general reset

                // adding block in the field
                field[index_l][index_c] = 'O';
                console.log(`Iteration: ${index_l*line.length + index_c}/${130*130}`);
                
                if(guard.move() == 'loop'){
                    loops++;
                }
            }            
        }        
    }

    console.log(`Found ${loops} loop(s) in ${performance.now() - startTime.toFixed(0)} ms`);
}



main();