export class Canvas{
  constructor(map){

    this.map = map;
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext("2d");
    
    this.canvas.width = this.canvas.style.width = map.width * 2;
    this.canvas.height = this.canvas.style.height = map.height * 2;

    this.draw();

  }

  draw(){
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width * 2, this.canvas.height * 2);

    this.ctx.fillStyle = 'white';
    for(const robot of this.map.robots){
      this.ctx.fillRect(robot.finalPosX*2, robot.finalPosY*2, 2, 2);
    }
  }
}