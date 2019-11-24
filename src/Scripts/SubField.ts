import { Field } from './Field';
import { netWidth } from './constants';

export class SubField extends Field {
  constructor(index: number, total: number, width: number, height: number) {
    const w = width / total - netWidth / 2;
    super((w + netWidth) * index, w, height);
  }
}
