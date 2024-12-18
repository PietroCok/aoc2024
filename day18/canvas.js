export class Canvas {
  constructor(board) {
    this.board = board;
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext("2d");

    this.scale = 8;

    this.canvas.width = this.canvas.style.width = board.length * this.scale;
    this.canvas.height = this.canvas.style.height = board[0]?.length * this.scale;

    this.draw();
  }

  draw(path) {
    // background
    this.ctx.fillStyle = 'lightgray';
    this.ctx.fillRect(0, 0, this.canvas.width * this.scale, this.canvas.height * this.scale);

    // muri
    for (const [row_index, row] of this.board.entries()) {
      for (const [col_index, col] of row.entries()) {
        if (col == '#') {
          this.ctx.fillStyle = 'black';
          this.ctx.fillRect(col_index * this.scale, row_index * this.scale, this.scale, this.scale);
        }
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