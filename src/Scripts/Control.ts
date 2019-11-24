import { VirtualObject } from './VirtualObject';
import { ReplayData } from './types';

export class Control extends VirtualObject {
  private bufferUp = false;
  private bufferLeft = false;
  private bufferRight = false;
  private previousUp = false;
  private previousLeft = false;
  private previousRight = false;

  public up = false;
  public left = false;
  public right = false;

  update() {
    this.previousUp = this.up;
    this.previousLeft = this.left;
    this.previousRight = this.right;
    this.left = this.bufferLeft;
    this.up = this.bufferUp;
    this.right = this.bufferRight;
  }

  reset() {
    this.up = false;
    this.left = false;
    this.right = false;
    this.bufferUp = false;
    this.bufferLeft = false;
    this.bufferRight = false;
    this.previousUp = false;
    this.previousLeft = false;
    this.previousRight = false;
  }

  setUp(on: boolean) {
    this.bufferUp = on;
  }

  setLeft(on: boolean) {
    this.bufferLeft = on;
  }

  setRight(on: boolean) {
    this.bufferRight = on;
  }

  bind() {}

  unbind() {}

  cancelBubble(evt: Event) {
    if (evt.preventDefault) evt.preventDefault();
    else evt.returnValue = false;

    if (evt.stopPropagation) evt.stopPropagation();
    else evt.cancelBubble = true;
  }

  copy(): ReplayData {
    if (this.previousUp === this.up && this.previousRight === this.right && this.previousLeft === this.left) {
      return 0;
    }

    return {
      l: this.left ? 1 : 0,
      u: this.up ? 1 : 0,
      r: this.right ? 1 : 0,
    };
  }
}
