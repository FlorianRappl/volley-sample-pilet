import { Resources } from './Resources';
import { ImageResourceType, ResourceLocator } from './types';

export class ImageResources extends Resources<HTMLImageElement> implements ImageResourceType {
  constructor(list: Array<ResourceLocator>) {
    super(list.length);

    for (const entry of list) {
      const item = document.createElement('img');
      item.src = entry.path;
      item.onload = () => this.loaded();
      this.setResource(entry.name, item);
    }
  }
}
