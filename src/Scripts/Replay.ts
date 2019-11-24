import { VirtualObject } from './VirtualObject';
import { Keyboard } from './Keyboard';
import { Net } from './Net';
import { Ball } from './Ball';
import { ReplayViewPort } from './ReplayViewPort';
import { ReplayBot } from './ReplayBot';
import { timeSlices, logicStep } from './constants';
import { BallType, PlayerType, PlayerInfo, ReplayData, AppType } from './types';

export class Replay extends VirtualObject {
  private beach: string;
  private ballx: number;
  private bally: number;
  private data: Array<Array<ReplayData>>;
  private players: Array<PlayerInfo>;
  private speed: number;
  private loop: any;
  private keys: Keyboard;
  private running: boolean;

  public count: number;
  public contacts: number;

  constructor(beach: string, ball: BallType, players: Array<PlayerType>) {
    super();
    this.beach = beach;
    this.ballx = ball.x;
    this.bally = ball.y;
    this.data = [];
    this.players = [];
    this.count = 0;
    this.contacts = 0;
    this.speed = 2;
    this.loop = null;
    this.keys = new Keyboard([27, 37, 39]);
    this.running = false;

    for (const player of players) {
      this.players.push({
        color: player.color,
        name: player.name,
        country: player.country,
        avatar: player.avatar,
        points: player.points,
        sets: player.sets,
      });
    }
  }

  import(raw) {
    const replay = JSON.parse(raw);

    Object.keys(replay).forEach(key => {
      this[key] = replay[key];
    });
  }

  export() {
    return JSON.stringify({
      beach: this.beach,
      ballx: this.ballx,
      bally: this.bally,
      data: this.data,
      players: this.players,
      count: this.count,
      contacts: this.contacts,
    });
  }

  addData(players: Array<PlayerType>) {
    const inputs: Array<ReplayData> = [];
    this.contacts = 0;

    for (const player of players) {
      inputs.push(player.input.copy());
      this.contacts += player.totalContacts;
    }

    //Before starting to add data - look if the data is worth saving (no action = not worth)
    if (this.count === 0) {
      let containsData = false;

      for (let i = inputs.length; i--; ) {
        if (inputs[i]) {
          containsData = true;
          break;
        }
      }

      if (!containsData) return;
    }

    this.data.push(inputs);
    this.count++;
  }

  faster() {
    this.speed += 0.25;

    if (this.speed > 4.0) this.speed = 4.0;
  }

  slower() {
    this.speed -= 0.25;

    if (this.speed < 0.25) this.speed = 0.25;
  }

  play(app: AppType, continuation: () => void) {
    if (this.running) return;

    const game = app.game;
    this.running = true;
    game.pause();

    const replayBots = [];
    const net = new Net(game.field);
    const ball = new Ball(app, game.field);
    const view = new ReplayViewPort(app, replayBots, game.field, net, ball);
    const data = this.data;

    let frames = this.count;
    let index = 0;

    view.setBackground(this.beach);
    ball.x = this.ballx;
    ball.y = this.bally;
    this.keys.bind();

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      const bot = new ReplayBot(app, game.players[i].container);
      bot.setIdentity(player.name, player.color, player.avatar, player.country);
      replayBots.push(bot);
    }

    const ticker = () => {
      this.keys.update();

      if (this.keys.up || index === frames) {
        return this.stop(app, continuation);
      }

      const input = data[index++];

      for (let i = replayBots.length; i--; ) {
        replayBots[i].steer(input[i]);
      }

      for (let t = timeSlices; t--; ) {
        ball.logic();
        net.logic();

        for (let i = replayBots.length; i--; ) {
          replayBots[i].logic();
          ball.collision(replayBots[i]);
        }

        ball.collision(net);
      }

      if (this.keys.left) this.slower();
      else if (this.keys.right) this.faster();

      this.keys.reset();
      view.speed = this.speed;
      view.paint(app.context);
      this.loop = setTimeout(ticker, logicStep / this.speed);
    };

    ticker();
  }

  stop(app: AppType, continuation: () => void) {
    if (this.running) {
      this.running = false;
      this.keys.reset();
      this.keys.unbind();
      clearTimeout(this.loop);

      if (continuation) {
        continuation.call(app.game);
      }

      app.game.play();
    }
  }
}
