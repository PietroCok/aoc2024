import { Canvas } from './canvas.js';

async function main() {
    //const data = await getData('test.txt');
    const data = await getData('input.txt');

    let _r = data.split('\r\n')

    const map = {
        width: 101,
        height: 103,
        robots: [],
        moveTime: function(seconds = 1){
            for(const robot of this.robots){
                robot.finalPosX = (robot.finalPosX + (robot.vX * seconds)) % this.width;
                robot.finalPosY = (robot.finalPosY + (robot.vY * seconds)) % this.height;

                if(robot.finalPosX < 0){
                    robot.finalPosX = this.width + robot.finalPosX;
                }

                if(robot.finalPosY < 0){
                    robot.finalPosY = this.height + robot.finalPosY;
                }
            }
        },
        view: function(i){
            const matrix = new Array(this.height).fill('.');
            for(const [index, row] of matrix.entries()){
                matrix[index] =  new Array(this.width).fill('.');
            }

            for(const robot of this.robots){
                let x = robot.finalPosX;
                let y = robot.finalPosY;
                
                if(matrix[y][x] == '.'){
                    matrix[y][x] = 1;
                } else {
                    matrix[y][x] += 1;
                }
            }

            let matrix_str = matrix.map(y => y.join('')).join('\r\n')

            if(i != undefined){
                if(matrix_str.match('1111111111111')){
                    console.log(i+1);
                    console.log(matrix_str);
                    return true;
                }
            } else {
                console.log(matrix_str);
            }
        },
        getSecurityScore: function(){
            // get robots in each quadrant
            let _q00 = 0;
            let _q01 = 0;
            let _q10 = 0;
            let _q11 = 0;
            const middleX = Math.floor(this.width/2);
            const middleY = Math.floor(this.height/2);
            // console.log(middleX, middleY);

            for(let robot of this.robots){
                if(robot.finalPosX < middleX && robot.finalPosY < middleY){
                    _q00++;
                }

                if(robot.finalPosX > middleX && robot.finalPosY < middleY){
                    _q01++;
                }

                if(robot.finalPosX < middleX && robot.finalPosY > middleY){
                    _q10++;
                }

                if(robot.finalPosX > middleX && robot.finalPosY > middleY){
                    _q11++;
                }
            }

            return _q00 * _q01 * _q10 * _q11;
        },
        resetPosition: function(){
            for(const robot of this.robots){
                robot.finalPosX = robot.x;
                robot.finalPosY = robot.y;
            }
        }
    }
    
    for(let _robot of _r){
        let robot = {
            x: getPosition(_robot)[0],
            y: getPosition(_robot)[1],
            vX: getVelocity(_robot)[0],
            vY: getVelocity(_robot)[1],
            finalPosX: getPosition(_robot)[0],
            finalPosY: getPosition(_robot)[1],
        }
        map.robots.push(robot);
    }

    console.log(map);
    
    // Part 1
    const seconds = 100;
    map.moveTime(seconds);
    //map.view();
    console.log(`Security score after ${seconds} seconds: ${map.getSecurityScore()}`);


    // Part 2
    // will print the image and index
    let time = 0;
    map.resetPosition();
    console.log(map);
    for(let i = 0; i < 10_000; i++){
        time = map.moveTime();
        if(map.view(i)){
            time = i+1;
            break;
        }
    }

    // Visualization for part 2
    const canvas = new Canvas(map);
    const targetFrame = time;
    const framesToShow = 500;
    const startFrame = targetFrame - framesToShow < 0 ? 0 : targetFrame - framesToShow; // show only last x frames
    map.resetPosition();
    map.moveTime(startFrame);

    animateDrones(0);

    function animateDrones(i){
        if(i >= framesToShow) return;
        
        map.moveTime();
        canvas.draw();

        setTimeout(() => {
            animateDrones(i+1)
        }, 10);
    }

    function getPosition(string){
        const regex = /(?<pos>(?<=p=)-*\d+,-*\d+)/gm;
        const position = string.match(regex)[0].split(',');
        return [Number(position[0]), Number(position[1])];
    }

    function getVelocity(string){
        const regex = /(?<vel>(?<=v=)-*\d+,-*\d+)/gm;
        const velocity = string.match(regex)[0].split(',');
        return [Number(velocity[0]), Number(velocity[1])];
    }
}




main();