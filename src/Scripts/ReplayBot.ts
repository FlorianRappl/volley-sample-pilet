import { Player } from './Player';
import { Control } from './Control';
import { AppType, ContainerType, ReplayData } from './types';

export class ReplayBot extends Player {
  constructor(app: AppType, container: ContainerType) {
    super(app, container, new Control());
  }

  steer(data?: ReplayData) {
    if (data) {
      this.input.setUp(!!data.u);
      this.input.setLeft(!!data.l);
      this.input.setRight(!!data.r);
    }

    super.steer();
  }

  scorePoint() {
    //Nothing to do here!
  }
}
