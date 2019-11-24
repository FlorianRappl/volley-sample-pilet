import { DrawObject } from './DrawObject';
import { acceleration, ballReflection, ballResistance } from './constants';
import { ContainerType, FigureType, BallType } from './types';

export class Figure extends DrawObject implements FigureType {
  protected friction: number;

  public container: ContainerType;
  public wh = 0;
  public hh = 0;
  public vx = 0;
  public vy = 0;

  constructor(container: ContainerType, w: number, h: number) {
    super(0, 0, w, h);
    this.container = container;
    this.friction = ballReflection;
    this.wh = this.width / 2;
    this.hh = this.height / 2;
    this.setPositionFromContainerOrigin();
    this.setVelocity(0, 0);
  }

  setPositionFromContainerOrigin() {
    const x = this.container.x + this.container.wh;
    const y = this.hh;
    this.setPosition(x, y);
  }

  getTotalVelocity() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  }

  setVelocity(vx: number, vy: number) {
    this.vx = vx;
    this.vy = vy;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get bottom() {
    return this.y - this.hh;
  }

  get top() {
    return this.y + this.hh;
  }

  get left() {
    return this.x - this.wh;
  }

  get right() {
    return this.x + this.wh;
  }

  checkField() {
    if (this.y < this.hh) {
      this.y = this.hh;
      this.vy = 0;
    }

    if (this.left < this.container.x) {
      this.vx = 0;
      this.x = this.container.x + this.wh;
    } else if (this.right > this.container.x + this.container.width) {
      this.vx = 0;
      this.x = this.container.x + this.container.width - this.wh;
    }
  }

  collision(figure: FigureType) {}

  logic() {
    this.vy -= acceleration;
    this.x += this.vx;
    this.y += this.vy;
    this.checkField();
  }

  paint(context: CanvasRenderingContext2D) {}

  hit(dx: number, dy: number, ball: BallType) {
    const distance = dx * dx + dy * dy;
    const angle = Math.atan2(dy, dx);
    const v = ball.getTotalVelocity();
    let ballVx = Math.cos(angle) * this.friction * v;
    let ballVy = Math.sin(angle) * this.friction * v;
    ballVx += (ballResistance * ball.omega * dy) / distance;
    ballVy -= (ballResistance * ball.omega * dx) / distance;
    ball.setVelocity(ballVx, ballVy);
  }
}
