import { VirtualObject } from './VirtualObject';

export class Lobby extends VirtualObject {
  public messages: Array<string>;
  public created: Date;

  constructor() {
    super();
    this.messages = [];
    this.created = new Date();
  }
}
