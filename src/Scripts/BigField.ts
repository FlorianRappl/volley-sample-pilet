import { Field } from './Field';

export class BigField extends Field {
  constructor(width: number, height: number) {
    super(0, width, height);
  }

  paint(context: CanvasRenderingContext2D) {
    context.strokeStyle = '#cccccc';
    context.beginPath();
    context.rect(0, 0, this.width, this.height);
    context.closePath();
    context.stroke();
  }
}
