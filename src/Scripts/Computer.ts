import { Player } from './Player';
import { Control } from './Control';
import { AppType, ContainerType } from './types';

export class Computer extends Player {
  constructor(app: AppType, container: ContainerType) {
    super(app, container, new Control());
    this.setIdentity('Computer', '#FF6633');
  }

  steer() {
    const r = ~~(Math.random() * 6);

    switch (r) {
      case 0:
        this.input.setUp(true);
        break;
      case 1:
        this.input.setLeft(true);
        this.input.setRight(false);
        break;
      case 2:
        this.input.setRight(true);
        this.input.setLeft(false);
        break;
      case 4:
        this.input.setRight(false);
        this.input.setLeft(false);
        break;
      case 5:
        this.input.setUp(false);
        break;
    }

    super.steer();
  }
}
