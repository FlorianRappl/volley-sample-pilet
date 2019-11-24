import { Figure } from './Figure';
import { Player } from './Player';
import { ballStartHeight, ballDrag } from './constants';
import { ContainerType, BallType, AppType, FigureType } from './types';

export class Ball extends Figure implements BallType {
  private ballImage: CanvasImageSource;
  private rotation: number;

  public radius: number;
  public omega: number;
  public sleeping: boolean;
  public dead: boolean;

  constructor(app: AppType, container: ContainerType) {
    const radius = 48;
    const diameter = 2 * radius;
    super(container, diameter, diameter);
    this.ballImage = app.resources.images.getResource('ball');
    this.radius = radius;
    this.rotation = 0;
    this.omega = 0;
    this.sleeping = true;
    this.dead = false;
  }

  setVelocity(vx: number, vy: number) {
    this.sleeping = false;
    super.setVelocity(vx, vy);
  }

  setServe(subfield: ContainerType) {
    const x = subfield.x + subfield.width / 2;
    const y = ballStartHeight;
    this.sleeping = true;
    this.dead = false;
    this.omega = 0;
    this.rotation = 0;
    this.vx = 0;
    this.vy = 0;
    this.setPosition(x, y);
  }

  collision(figure: FigureType) {
    if (this.dead) {
      if (
        figure instanceof Player &&
        (this.x < figure.container.x || this.x > figure.container.x + figure.container.width)
      )
        figure.scorePoint();

      return;
    }

    figure.collision(this);
  }

  checkField() {
    if (this.y <= this.radius) {
      this.dead = true;
      this.y = this.radius;
    }
  }

  logic() {
    if (this.sleeping || this.dead) return;

    //First let's check for contact with the boundary
    if (this.x <= this.radius) {
      this.vx *= -1;
      this.vy += this.omega;
    } else if (this.x >= this.container.width - this.radius) {
      this.vx *= -1;
      this.vy -= this.omega;
    }

    //Let's handle the spin!
    if (this.omega) {
      const v = this.getTotalVelocity();
      const dx = (this.vy * this.omega * ballDrag) / v;
      const dy = -(this.vx * this.omega * ballDrag) / v;
      this.vx += dx;
      this.vy += dy;
    }

    //Perform the updates on velocity etc.
    this.rotation += this.omega;
    super.logic();
  }

  changeSpin(vx: number, vy: number, dx: number, dy: number, sign: number) {
    const distance = dx * dx + dy * dy;
    const scalar = (dx * vx + dy * vy) / distance;
    const svx = vx + sign * dx * scalar;
    const svy = vy + sign * dy * scalar;
    this.omega += (svx * dy - svy * dx) / distance;
  }

  spin(vx: number, vy: number, dx: number, dy: number) {
    this.changeSpin(this.vx, this.vy, dx, dy, 1);
    this.changeSpin(vx, vy, dx, dy, -1);
  }

  paint(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.x, this.container.height - this.y);
    context.rotate(this.rotation);
    context.drawImage(this.ballImage, -this.radius, -this.radius);
    context.restore();
  }
}
