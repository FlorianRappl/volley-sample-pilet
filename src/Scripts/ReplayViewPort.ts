import { ViewPort } from './ViewPort';
import { gameMessages } from './constants';
import { PlayerType, ContainerType, FigureType, BallType, AppType } from './types';

export class ReplayViewPort extends ViewPort {
  public speed: number;

  constructor(app: AppType, players: Array<PlayerType>, field: ContainerType, net: FigureType, ball: BallType) {
    super(app, field, players, net, ball, [], 0);
    this.speed = 1;
    this.setMessage(gameMessages.Replay);
  }

  setup() {}

  paintScore() {}

  paint(context: CanvasRenderingContext2D) {
    const { width, height } = context.canvas;
    super.paint(context);
    context.save();
    context.translate(width - 20, height - 80);
    context.textAlign = 'right';
    context.fillStyle = '#C5C7BC';
    context.font = '24pt Merge';
    context.fillText('x' + this.speed, 0, 0);
    context.restore();
  }
}
