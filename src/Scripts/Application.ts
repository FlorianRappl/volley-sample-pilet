import { VirtualObject } from './VirtualObject';
import { Game } from './Game';
import { SubField } from './SubField';
import { Keyboard } from './Keyboard';
import { Player } from './Player';
import { ImageResources } from './ImageResources';
import { AudioResources } from './AudioResources';
import { toList } from './utils';
import { AppType, ResourcesType } from './types';

const images = toList(require('../Content/images/*.*'));
const sounds = toList(require('../Content/sounds/*.*'));
const beaches = toList(require('../Content/beaches/*.*'));
const avatars = toList(require('../Content/avatars/*.*'));
const flags = toList(require('../Content/flags/*.*'));

export class Application extends VirtualObject implements AppType {
  private canvas: HTMLCanvasElement;

  public game: Game;
  public root: HTMLElement;
  public resources: ResourcesType;

  constructor(root: HTMLElement) {
    super();
    this.resources = {
      avatars: new ImageResources(avatars),
      beaches: new ImageResources(beaches),
      flags: new ImageResources(flags),
      images: new ImageResources(images),
      sounds: new AudioResources(sounds),
    };
    this.mount(root);
    this.game = new Game(this);
  }

  get context() {
    return this.canvas.getContext('2d');
  }

  get height() {
    return this.context.canvas.height;
  }

  get width() {
    return this.context.canvas.width;
  }

  mount(root: HTMLElement) {
    this.root = root;
    this.canvas = root.querySelector('canvas');
    this.game && this.game.play();
  }

  unmount() {
    this.game.pause();
  }

  run() {
    const { width, height } = this;
    this.game.reset();

    // Create left player
    const fieldLeft = new SubField(0, 2, width, height);
    const keyboardLeft = new Keyboard([87, 65, 68]);
    const playerLeft = new Player(this, fieldLeft, keyboardLeft);
    playerLeft.setIdentity('Lefty', '#0000FF', 'dropperdude', 'de');
    this.game.addPlayer(playerLeft);

    // Create right player
    const fieldRight = new SubField(1, 2, width, height);
    const keyboardRight = new Keyboard([38, 37, 39]);
    const playerRight = new Player(this, fieldRight, keyboardRight);
    playerRight.setIdentity('Righto', '#FF0000', 'cybertron', 'at');
    this.game.addPlayer(playerRight);

    this.game.beginMatch();
  }
}
