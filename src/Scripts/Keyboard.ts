import { Control } from './Control';

export class Keyboard extends Control {
  private codes: Record<number, (status: boolean) => void>;
  private downhandler: (ev: KeyboardEvent) => void;
  private uphandler: (ev: KeyboardEvent) => void;
  private presshandler: (ev: KeyboardEvent) => void;

  constructor(codeArray: [number, number, number]) {
    super();
    this.codes = {
      [codeArray[0]]: status => this.setUp(status),
      [codeArray[1]]: status => this.setLeft(status),
      [codeArray[2]]: status => this.setRight(status),
    };
    let handleEvent = false;
    this.downhandler = event => {
      handleEvent = this.handler(event, true);
      return handleEvent;
    };
    this.uphandler = event => {
      handleEvent = this.handler(event, false);
      return handleEvent;
    };
    this.presshandler = event => {
      if (!handleEvent) this.cancelBubble(event);
      return handleEvent;
    };
  }

  bind() {
    document.addEventListener('keydown', this.downhandler, false);
    document.addEventListener('keyup', this.uphandler, false);
    document.addEventListener('keypress', this.presshandler, false);
    //The last one is required to cancel bubble event in Opera!
  }

  unbind() {
    document.removeEventListener('keydown', this.downhandler, false);
    document.removeEventListener('keyup', this.uphandler, false);
    document.removeEventListener('keypress', this.presshandler, false);
  }

  handler(e: KeyboardEvent, status: boolean) {
    if (this.codes[e.keyCode]) {
      const cb = this.codes[e.keyCode];
      cb(status);
      this.cancelBubble(e);
      return false;
    }

    return true;
  }
}
