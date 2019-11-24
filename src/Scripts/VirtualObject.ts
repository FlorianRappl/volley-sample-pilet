export class VirtualObject {
  random(min: number, max: number) {
    const d = max - min;
    return Math.min(Math.floor(Math.random() * d), max - 1) + min;
  }

  format(str: string, ...rest: Array<any>) {
    for (let i = 0; i < rest.length; i++) {
      str = str.replace(new RegExp('\\{' + i + '\\}', 'g'), rest[i]);
    }

    return str;
  }

  createElement(kind: string, parent: HTMLElement, content?: string) {
    const element = document.createElement(kind);
    parent.appendChild(element);

    if (content) {
      element.innerHTML = content;
    }

    return element;
  }

  removeElement(element: HTMLElement) {
    element.parentNode.removeChild(element);
    return element;
  }
}
