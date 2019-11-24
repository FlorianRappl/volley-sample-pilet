import { Figure } from './Figure';
import { netHeight, netWidth } from './constants';
import { ContainerType, BallType } from './types';

export class Net extends Figure {
  private radius: number;
  private originX: number;

  constructor(container: ContainerType) {
    super(container, netWidth, netHeight);
    this.radius = netWidth / 2;
    this.y = netHeight;
    this.originX = this.x;
    this.friction = 1;
  }

  reset() {
    this.x = this.originX;
    this.vx = 0;
  }

  collision(ball: BallType) {
    const dx = ball.x - this.x;
    const dy = ball.y - this.y;
    const br = ball.radius + this.radius;

    if (dy <= 0) {
      let sign = 0;

      if (ball.vx > 0 && dx + br >= 0 && dx <= this.radius) sign = -1;
      else if (ball.vx < 0 && dx - br <= 0 && dx + this.radius >= 0) sign = 1;

      if (sign != 0) {
        this.vx = ball.vx * 5;
        ball.vx = -ball.vx;
        ball.vy += sign * ball.omega;
      }

      return;
    }

    if (Math.sqrt(dx * dx + dy * dy) <= br) this.hit(dx, dy, ball);
  }

  hit(dx: number, dy: number, ball: BallType) {
    super.hit(dx, dy, ball);
    ball.spin(this.vx, this.vy, dx, dy);
  }

  logic() {
    this.x += this.vx;
    this.vx -= this.x - this.originX;
    //Damp the force slightly
    this.vx *= 0.99;
  }

  paint(context: CanvasRenderingContext2D) {
    const alpha = Math.atan2(this.x - this.originX, this.height);

    context.save();
    context.translate(this.originX, this.container.height);
    context.rotate(alpha);
    context.strokeStyle = '#666666';
    context.fillStyle = '#999999';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(0, -this.y, this.wh, 0, Math.PI, true);
    context.lineTo(-this.wh, 0);
    context.lineTo(this.wh, 0);
    context.lineTo(this.wh, -this.y);
    context.fill();
    context.stroke();
    context.closePath();
    context.restore();
  }
}
