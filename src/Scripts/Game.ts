import { VirtualObject } from './VirtualObject';
import { BigField } from './BigField';
import { Net } from './Net';
import { Ball } from './Ball';
import { ViewPort } from './ViewPort';
import { Replay } from './Replay';
import {
  beachNames,
  gameMessages,
  defaultMaxPoints,
  defaultMaxSets,
  pointBreakTime,
  logicStep,
  setWonTime,
  timeSlices,
} from './constants';
import { ContainerType, PlayerType, AppType, GameType } from './types';

const beaches = Object.keys(beachNames);

export class Game extends VirtualObject implements GameType {
  private running: boolean;
  private active: boolean;
  private observers: Array<PlayerType>;
  private wait: number;
  private app: AppType;
  private beach: string;
  private loop: any;
  private replays: Array<Replay>;
  private instantReplay: Replay;
  private viewPort: ViewPort;

  public sets: Array<PlayerType>;
  public net: Net;
  public ball: Ball;
  public maxSets: number;
  public field: BigField;
  public maxPoints: number;
  public players: Array<PlayerType>;

  constructor(app: AppType) {
    super();
    this.app = app;
    this.players = [];
    this.observers = [];
    this.replays = [];
    this.instantReplay = null;
    this.sets = [];
    this.field = new BigField(app.width, app.height);
    this.ball = new Ball(app, this.field);
    this.net = new Net(this.field);
    this.loop = null;
    this.running = false;
    this.active = false;
    this.maxPoints = defaultMaxPoints;
    this.maxSets = defaultMaxSets;
    this.wait = 0;
    this.beach = '';
    this.viewPort = new ViewPort(app, this.field, this.players, this.net, this.ball, this.sets, this.maxSets);
  }

  contact(player: PlayerType) {
    let touching = false;

    for (const gamer of this.players) {
      if (gamer === player) {
        touching = gamer.addContact();
      } else {
        gamer.contacts = 0;
      }
    }

    return touching;
  }

  reset() {
    this.players.splice(0, this.players.length);
    this.observers.splice(0, this.observers.length);
    this.replays.splice(0, this.replays.length);
    this.sets.splice(0, this.sets.length);
  }

  setWon(player: PlayerType) {
    for (const gamer of this.players) {
      gamer.points = 0;
    }

    player.sets++;
    this.sets.push(player);

    if (player.sets === this.maxSets) {
      this.viewPort.setMessage(this.format(gameMessages.Over, player.name));
      this.endMatch();
      return false;
    } else {
      this.viewPort.setMessage(this.format(gameMessages.Set, player.name), setWonTime);
      return true;
    }
  }

  addPlayer(player: PlayerType) {
    this.players.push(player);
  }

  addObserver(observer: PlayerType) {
    this.observers.push(observer);
  }

  saveReplay() {
    this.replays.push(this.instantReplay);
  }

  recordReplay() {
    this.instantReplay = new Replay(this.beach, this.ball, this.players);
  }

  detectInstantReplay() {
    if (this.replays.length) {
      const rep = this.replays[this.replays.length - 1];

      if (rep.contacts > 12 && rep.count > 220) {
        return true;
      }
    }

    return false;
  }

  playLastReplay(continuation: () => void) {
    if (this.replays.length) {
      this.replays[this.replays.length - 1].play(this.app, continuation);
    }
  }

  continuation() {
    this.net.reset();

    for (const player of this.players) {
      player.reset();
    }

    this.recordReplay();
  }

  setServe(container: ContainerType) {
    this.saveReplay();
    this.ball.setServe(container);

    if (this.detectInstantReplay()) {
      this.playLastReplay(this.continuation);
      return;
    }

    this.wait = Math.ceil(pointBreakTime / logicStep);
    this.continuation();
  }

  tick() {
    if (!this.wait) {
      for (const player of this.players) {
        player.steer();
      }

      this.instantReplay.addData(this.players);

      for (let t = timeSlices; t--; ) {
        this.ball.logic();
        this.net.logic();

        for (let i = this.players.length; i--; ) {
          this.players[i].logic();
          this.ball.collision(this.players[i]);
        }

        this.ball.collision(this.net);
      }
    } else {
      this.wait--;
    }

    this.viewPort.paint(this.app.context);
  }

  beginMatch() {
    this.active = true;
    const r1 = this.random(0, beaches.length);
    this.viewPort.setMessage(gameMessages.Start, setWonTime);
    this.beach = beaches[r1];
    this.viewPort.setBackground(this.beach);
    this.viewPort.setup();
    const r2 = this.random(0, this.players.length);
    this.ball.setServe(this.players[r2].container);
    this.continuation();
    this.play();
  }

  endMatch() {
    this.saveReplay();
    this.viewPort.paint(this.app.context);
    this.pause();
    this.active = false;
  }

  play() {
    if (!this.running && this.active) {
      this.running = true;

      for (const player of this.players) {
        player.input.bind();
      }

      this.loop = setInterval(() => this.tick(), logicStep);
    }
  }

  pause() {
    if (this.running && this.active) {
      this.running = false;

      for (const player of this.players) {
        player.input.unbind();
      }

      clearInterval(this.loop);
    }
  }
}
