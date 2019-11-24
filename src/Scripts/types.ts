export type ReplayData =
  | 0
  | {
      u: 0 | 1;
      l: 0 | 1;
      r: 0 | 1;
    };

export interface InputType {
  left: boolean;
  right: boolean;
  up: boolean;
  update(): void;
  reset(): void;
  setUp(state: boolean): void;
  setLeft(state: boolean): void;
  setRight(state: boolean): void;
  copy(): ReplayData;
  bind(): void;
  unbind(): void;
}

export interface GameType {
  setServe(container: ContainerType): void;
  setWon(player: PlayerType): boolean;
  contact(player: PlayerType): boolean;
  play(): void;
  pause(): void;
  maxPoints: number;
  sets: Array<PlayerType>;
  players: Array<PlayerType>;
  field: ContainerType;
  maxSets: number;
  net: FigureType;
  ball: BallType;
}

export interface ResourceLocator {
  name: string;
  path: string;
}

export interface ImageResourceType {
  getResource(name: string): CanvasImageSource;
}

export interface AudioResourceType {
  getResource(name: string): HTMLAudioElement;
}

export interface ResourcesType {
  avatars: ImageResourceType;
  beaches: ImageResourceType;
  flags: ImageResourceType;
  images: ImageResourceType;
  sounds: AudioResourceType;
}

export interface AppType {
  game: GameType;
  resources: ResourcesType;
  width: number;
  height: number;
  root: HTMLElement;
  context: CanvasRenderingContext2D;
}

export interface DrawableType {
  paint(context: CanvasRenderingContext2D): void;
}

export interface FigureType extends DrawableType {
  logic(): void;
  collision(figure: FigureType): void;
  x: number;
  y: number;
  bottom: number;
  top: number;
  left: number;
  right: number;
}

export interface PlayerInfo {
  points: number;
  name: string;
  color: string;
  avatar: string;
  country: string;
  sets: number;
}

export interface PlayerType extends PlayerInfo, FigureType {
  paintPulse(context: CanvasRenderingContext2D): void;
  addContact(): boolean;
  reset(): void;
  steer(): void;
  input: InputType;
  totalContacts: number;
  container: ContainerType;
  contacts: number;
}

export interface BallType extends FigureType {
  getTotalVelocity(): number;
  setVelocity(x: number, y: number): void;
  setPosition(x: number, y: number): void;
  spin(vx: number, vy: number, dx: number, dy: number): void;
  omega: number;
  sleeping: boolean;
  vx: number;
  vy: number;
  wh: number;
  radius: number;
  dead: boolean;
}

export interface ContainerType extends DrawableType {
  x: number;
  wh: number;
  width: number;
  height: number;
}
