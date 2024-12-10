export class Canvas{
  constructor(disk){
    
    this.disk = disk;
    this.size = disk.length;
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth - 20;
    this.canvas.height = 100;
    this.blockSize = this.canvas.width / this.size;
    console.log('Block size: ', this.blockSize);
    
    this.drawAll();
  }

  update(from, to, size){
    this.draw(from, to, size);
  }

  draw(from, to, size){
    this.drawBlock(from, size, 'black');
    this.drawBlock(to, size, 'red');
  }

  drawAll(){
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    for(const [index, block] of this.disk.entries()){
      if(block != '.'){
        this.drawBlock(index, 1, 'red');
      }
    }
  }

  drawBlock(index, size, color){
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.blockSize * index, 0, this.blockSize * size, this.canvas.height);
  }
}