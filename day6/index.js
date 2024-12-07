async function main() {
    // const data = await getData('input.txt');
    const data = await getData('input_test.txt');

    console.log(data);

    const field = data.split('\r\n').map(line => line.split(''));


    const guard = {
        y: null,
        x: null,
        direction: null,
        isInField: false,
        uniquePos: new Set(),
        nextCell: {x: null, y: null},
        move: function () {
            console.log('moving');
            console.log(field.map(line => line.join("")).join('\r\n'));
            
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
                console.log('guard is outside of field');
                return;
            }

            if(this.nextCell.y < 0 || this.nextCell.y > field[0].length - 1){
                console.log('guard is outside of field');
                return;
            }

            // check if next cell is free
            if(field[this.nextCell.y][this.nextCell.x] == '#'){
                this.rotate();
                this.move();
                return;
            }

            // actual movement
            this.uniquePos.add(this.nextCell.x + '|' + this.nextCell.y)
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
        init: function () {
            for (let [index_l, line] of field.entries()) {
                for (let [index_r, row] of line.entries()) {
                    if (row != '#' && row != '.') {
                        this.x = index_r;
                        // direction
                        this.direction = row;
                        this.isInField = true;
                        break;
                    }
                }
                if (this.x) {
                    this.y = index_l;
                    break;
                }
            }
            this.uniquePos.add(this.x + '|' + this.y)
            this.move();
        }
    }

    guard.init();

    console.log(guard);

    // part 1
    console.log('Unique positions: ', guard.uniquePos.size);
    

}



main();