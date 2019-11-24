import { Figure } from './Figure';
import {
  twoPi,
  ballLaunch,
  ballSpeedup,
  pulseRunDecrease,
  maxSpeed,
  maxJump,
  maxContacts,
  pulseRecovery,
  acceleration,
  pulseJumpDecrease,
} from './constants';
import { ContainerType, BallType, PlayerType, AppType, InputType } from './types';

export class Player extends Figure implements PlayerType {
  private radius: number;
  private app: AppType;
  private pulse: number;
  private pulses: Array<number>;
  private pulseOffset: number;
  private isTouching: boolean;

  public contacts: number;
  public totalContacts: number;
  public sets: number;
  public input: InputType;
  public color: string;
  public name: string;
  public avatar: string;
  public country: string;
  public points: number;

  constructor(app: AppType, container: ContainerType, input: InputType) {
    const radius = 48;
    const diameter = 2 * radius;
    super(container, diameter, diameter);
    this.radius = radius;
    this.app = app;
    this.input = input;
    this.points = 0;
    this.sets = 0;
    this.pulses = [];
    this.pulseOffset = 0;
    this.color = 'rgb(0, 0, 0)';
    this.name = 'Player';
    this.avatar = 'atom.gif';
    this.country = 'sc';
    this.reset();
  }

  addContact() {
    if (!this.isTouching) {
      this.isTouching = true;
      this.contacts++;
      this.totalContacts++;
      return false;
    }

    return true;
  }

  setAvatar(avatar: string) {
    this.avatar = avatar;
  }

  setCountry(country: string) {
    this.country = country;
  }

  reset() {
    this.input.reset();
    this.setVelocity(0, 0);
    this.setPositionFromContainerOrigin();
    this.pulse = 1.0;
    this.contacts = 0;
    this.totalContacts = 0;
    this.isTouching = false;
  }

  scorePoint() {
    const { game } = this.app;
    let more = true;
    this.points++;

    if (this.points >= game.maxPoints) {
      let over = true;

      for (const player of game.players) {
        if (player !== this && Math.abs(player.points - this.points) < 2) {
          over = false;
          break;
        }
      }

      if (over) {
        more = game.setWon(this);
      }
    }

    if (more) {
      game.setServe(this.container);
    }
  }

  hit(dx: number, dy: number, ball: BallType) {
    const f = ball.sleeping ? ballLaunch : ballSpeedup;
    super.hit(dx, dy, ball);
    const sv = dx * this.vx + dy * this.vy;

    if (sv > 0) {
      const vd = (f * sv) / (dx * dx + dy * dy);
      ball.vx += dx * vd;
      ball.vy += dy * vd;
    }

    ball.spin(this.vx, this.vy, dx, dy);
  }

  collision(ball: BallType) {
    const { game } = this.app;
    const dx = ball.x - this.x;
    const dy = ball.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const br = ball.radius + this.radius;

    if (distance > br) {
      this.isTouching = false;
      return;
    }

    // Be sure that the ball stays outside of the player
    const sigma = br / distance;
    const dxp = sigma * dx;
    const dyp = sigma * dy;
    ball.setPosition(this.x + dxp, this.y + dyp);

    if (game.contact(this)) {
      return;
    }

    if (this.contacts > maxContacts) {
      ball.dead = true;
      return;
    }

    this.hit(dx, dy, ball);
  }

  setIdentity(name: string, color: string, avatar = this.avatar, flag = 'sc') {
    this.name = name;
    this.color = color;
    this.setAvatar(avatar);
    this.setCountry(flag);
  }

  updatePulse() {
    if (this.pulses.length === 100) {
      this.pulses[this.pulseOffset] = this.pulse;

      if (++this.pulseOffset === 100) this.pulseOffset = 0;
    } else this.pulses.push(this.pulse);
  }

  steer() {
    this.input.update();
    this.updatePulse();
  }

  logic() {
    if (this.input.left) {
      this.vx = -this.pulse * maxSpeed;
      this.pulse -= pulseRunDecrease;
    } else if (this.input.right) {
      this.vx = this.pulse * maxSpeed;
      this.pulse -= pulseRunDecrease;
    } else this.vx = 0;

    if (this.y === this.hh && this.input.up) {
      this.vy = maxJump + acceleration;
      this.pulse -= pulseJumpDecrease;
    }

    this.pulse = Math.max(Math.min(1, this.pulse + pulseRecovery), 0.5);
    super.logic();
  }

  paint(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.x, this.container.height - this.y);
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(0, 0, this.radius, 0, twoPi, true);
    context.fill();
    context.closePath();
    context.restore();
  }

  paintPulse(context: CanvasRenderingContext2D) {
    const res = this.app.resources;
    context.save();
    context.translate(this.container.x ? this.container.x + this.container.width - 255 : 55, 45);
    context.drawImage(res.avatars.getResource(this.avatar), this.container.x ? 202 : -32, -30, 30, 30);
    context.fillStyle = 'rgba(150, 150, 150, 0.2)';
    context.fillRect(0, -30, 200, 30);
    context.beginPath();
    context.moveTo(0, 0);

    for (let i = 0; i < this.pulses.length; i++) {
      let j = this.pulseOffset + i;

      if (j >= this.pulses.length) {
        j -= this.pulses.length;
      }

      context.lineTo(2 * i, -30 * (1 / this.pulses[j] - 1));
    }

    context.strokeStyle = this.color;
    context.stroke();
    context.closePath();
    context.drawImage(res.flags.getResource(this.country), this.container.x ? 175 : 9, -22, 16, 11);
    context.fillStyle = '#cccccc';
    context.textAlign = 'center';
    context.font = '24px Merge';
    context.fillText(this.name, 100, -10);
    context.restore();
  }
}
