import { Resources } from './Resources';
import { AudioResourceType, ResourceLocator } from './types';

export class AudioResources extends Resources<HTMLAudioElement> implements AudioResourceType {
  constructor(list: Array<ResourceLocator>) {
    super(list.length);

    for (const entry of list) {
      const item = document.createElement('audio');
      item.src = entry.path;
      item.onload = () => this.loaded();
      this.setResource(entry.name, item);
    }
  }
}
