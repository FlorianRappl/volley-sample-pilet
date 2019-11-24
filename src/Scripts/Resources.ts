export class Resources<T = HTMLElement> {
  public resources: Record<string, T>;
  public toload = 0;
  public total = 0;

	constructor(toload: number) {
		this.toload = toload;
		this.total = toload;
		this.resources = {};
  }

	loaded() {
		this.toload--;
  }

	setResource(name: string, value: T) {
		this.resources[name] = value;
  }

	getResource(name: string) {
		return this.resources[name];
	}
}
