import { ResourceLocator } from './types';

export function toList(resources: Record<string, { [ext: string]: string }>): Array<ResourceLocator> {
  return Object.keys(resources).map(name => {
    const res = resources[name];
    const ext = Object.keys(res)[0];
    const path = res[ext];
    return { name, path };
  });
}
