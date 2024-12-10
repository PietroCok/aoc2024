async function main() {
    // const data = await getData('input_test.txt');
    const data = await getData('input.txt');

    console.log(data);

    const map = data.split('\r\n').map(row => row.split(''));

    console.log(map);


    // find starting points
    let total_score_1 = 0;
    let total_score_2 = 0;
    for (let [y, row] of map.entries()) {
        for (let [x, tile] of row.entries()) {
            if (tile == '0') {
                // console.log(x, y);
                path = new Set();
                summits = [];
                getScore(map, x, y);

                let trail_score = [...path].filter(x => map[x.split('|')[1]][x.split('|')[0]] == 9).length;
                console.log('Path score (part 1): ', trail_score);
                console.log('Path score (part 2): ', summits.length);

                total_score_1 += trail_score;

                total_score_2 += summits.length;

                // visualize all path from this starting point
                const map_copy = JSON.parse(JSON.stringify(map));
                
                for (let [y, row] of map_copy.entries()) {
                    for (let [x, tile] of row.entries()) {
                        if (!path.has(x + '|' + y)) {
                            map_copy[y][x] = '.';
                        }
                    }
                }
                console.log(map_copy.map(tile => tile.join('')).join('\r\n'));
            }
        }
    }

    console.log('Total map score (part1): ', total_score_1);
    console.log('Total map score (part2): ', total_score_2);


}


function getScore(map, x, y) {
    // find location adiacent that has a height just 1 higher than current
    let current_height = map[y][x];

    // exit condition
    if (current_height == 9){
        path.add(x + '|' + y);
        summits.push(x + '|' + y);
        return;
    }

    if (y > 0 && map[y - 1][x] - 1 == current_height) {
        getScore(map, x, y - 1);
        path.add(x + '|' + y);
    }

    if (x > 0 && map[y][x - 1] - 1 == current_height) {
        getScore(map, x - 1, y);
        path.add(x + '|' + y);
    }

    if (y < map.length - 1 && map[y + 1][x] - 1 == current_height) {
        getScore(map, x, y + 1);
        path.add(x + '|' + y);
    }

    if (x < map.length - 1 && map[y][x + 1] - 1 == current_height) {
        getScore(map, x + 1, y);
        path.add(x + '|' + y);
    }
}

let path = new Set();
let summits = [];

main();