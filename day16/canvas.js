export class Canvas {
  constructor(board) {
    this.board = board;
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext("2d");

    this.scale = 6;

    this.canvas.width = this.canvas.style.width = board.length * this.scale;
    this.canvas.height = this.canvas.style.height = board[0]?.length * this.scale;

    this.draw();
  }

  draw(path, visited) {
    // background
    this.ctx.fillStyle = 'lightgray';
    this.ctx.fillRect(0, 0, this.canvas.width * this.scale, this.canvas.height * this.scale);
    // console.log(this.board);

    // muri
    for (const [row_index, row] of this.board.entries()) {
      for (const [col_index, col] of row.entries()) {
        if (col == '#') {
          this.ctx.fillStyle = 'black';
          this.ctx.fillRect(col_index * this.scale, row_index * this.scale, this.scale, this.scale);

        }

        if (col == 'E') {
          this.ctx.fillStyle = 'red';
          this.ctx.fillRect(col_index * this.scale, row_index * this.scale, this.scale, this.scale);
        }
      }
    }

    //visitati
    if(visited){
      this.ctx.fillStyle = 'yellow'
      for (const [index, node] of visited.entries()){
        this.ctx.fillRect(node.x * this.scale, node.y * this.scale, this.scale, this.scale);
      }
    }

    // percorso attuale
    if (path) {
      this.ctx.fillStyle = 'purple'
      for (const node of path) {
        this.ctx.fillRect(node.x * this.scale, node.y * this.scale, this.scale, this.scale);
      }
    }
  }
}