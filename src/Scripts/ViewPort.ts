import { DrawObject } from './DrawObject';
import { twoPi, setsWonRadius, beachNames } from './constants';
import { PlayerType, ContainerType, FigureType, AppType } from './types';

export class ViewPort extends DrawObject {
  private app: AppType;
  private background: CanvasImageSource;
  private players: Array<PlayerType>;
  private playerSets: Array<PlayerType>;
  private field: ContainerType;
  private ball: FigureType;
  private net: FigureType;
  private message: Array<string>;
  private persistent: boolean;
  private timeLeft: number;
  private radius: number;
  private totalTime: number;
  private sets: number;
  private factor: number;
  private offset: number;
  private shift: number;
  private maxSets: number;

  constructor(
    app: AppType,
    field: ContainerType,
    players: Array<PlayerType>,
    net: FigureType,
    ball: FigureType,
    playerSets: Array<PlayerType>,
    maxSets: number,
  ) {
    super(0, 0, app.width, app.height);
    this.app = app;
    this.field = field;
    this.players = players;
    this.net = net;
    this.ball = ball;
    this.message = [];
    this.persistent = false;
    this.timeLeft = 0;
    this.radius = setsWonRadius;
    this.totalTime = 0;
    this.maxSets = maxSets;
    this.playerSets = playerSets;
  }

  setup() {
    this.sets = 2 * this.maxSets - 1;
    this.factor = 2.5;
    this.offset = (this.maxSets - 1) * this.radius * this.factor;
    this.shift = 2 * this.radius;
  }

  setMessage(text: string, time?: number) {
    this.message = text.split('\n');
    this.persistent = !time;

    if (time) {
      this.timeLeft = time;
      this.totalTime = time;
    }
  }

  clearMessage() {
    this.message = [];
    this.persistent = false;
    this.timeLeft = 0;
    this.totalTime = 0;
  }

  setBackground(beach: string) {
    const name = beachNames[beach];
    this.background = this.app.resources.beaches.getResource(name);
  }

  paint(context: CanvasRenderingContext2D) {
    const { width, height } = context.canvas;
    context.clearRect(0, 0, width, height);
    context.drawImage(this.background, 0, 0);
    this.field.paint(context);
    this.net.paint(context);
    this.ball.paint(context);

    for (const player of this.players) {
      player.paint(context);
    }

    if (this.ball.bottom > height) {
      this.paintCursor(context, this.ball.x);
    }

    this.paintScore(context);

    for (const player of this.players) {
      player.paintPulse(context);
    }

    this.paintMessage(context);
  }

  paintMessage(context: CanvasRenderingContext2D) {
    if (!this.persistent) {
      if (!this.timeLeft) {
        return;
      }

      this.timeLeft--;
    }

    const { width, height } = context.canvas;
    context.save();
    context.translate(width / 2, height / 2);

    if (!this.persistent && this.timeLeft < this.totalTime / 2) {
      const scale = this.totalTime / ((this.timeLeft + 1) * 2);
      context.scale(scale, scale);
      context.globalAlpha = 1 / scale;
    }

    context.textAlign = 'center';
    const gradient = context.createLinearGradient(-width / 2, 0, width / 2, this.message.length * 70);
    gradient.addColorStop(0, 'rgb(255, 0, 0)');
    gradient.addColorStop(1, 'rgb(255, 255, 0)');
    context.shadowColor = '#666666';
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 5;
    context.fillStyle = gradient;
    context.font = '70px Merge';

    for (let i = 0; i < this.message.length; i++) {
      context.fillText(this.message[i], 0, i * 70);
    }

    context.restore();
  }

  paintScore(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.field.wh - this.offset, 30);

    for (let i = 0; i < this.sets; i++) {
      if (this.playerSets.length > i) {
        context.fillStyle = this.playerSets[i].color;
      } else {
        context.fillStyle = '#cccccc';
      }

      context.strokeStyle = '#666666';
      context.beginPath();
      context.arc(this.factor * i * this.radius, 0, this.radius, 0, twoPi, false);
      context.fill();
      context.stroke();
      context.closePath();
    }

    context.fillStyle = '#dddddd';
    context.font = '32pt Merge';
    context.textAlign = 'right';
    context.fillText(this.players[0].points.toString(), -this.shift, 15);
    context.textAlign = 'left';
    context.fillText(this.players[1].points.toString(), 2 * this.offset + this.shift, 15);
    context.restore();
  }

  paintCursor(context: CanvasRenderingContext2D, x: number) {
    context.save();
    context.translate(x, 10);
    context.fillStyle = '#000000';
    context.beginPath();
    context.moveTo(0, -5);
    context.lineTo(5, 5);
    context.lineTo(-5, 5);
    context.closePath();
    context.fill();
    context.restore();
  }
}
