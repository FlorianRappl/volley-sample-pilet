export class DrawObject {
  public width = 0;
  public height = 0;
  public x = 0;
  public y = 0;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.setPosition(x, y);
    this.width = width;
    this.height = height;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  paint(context: CanvasRenderingContext2D) {}
}
