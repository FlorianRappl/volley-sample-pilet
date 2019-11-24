import { DrawObject } from './DrawObject';
import { ContainerType } from './types';

export class Field extends DrawObject implements ContainerType {
  public wh = 0;
  public hh = 0;

	constructor(dx: number, width: number, height: number) {
		super(dx, 0, width, height);
		this.wh = width / 2;
		this.hh = height / 2;
	}
}
