const RE_NAME = /^\s*#N (.+)/m;

export class Conway {
  name: string;

  constructor(str: string) {
    const nameMatch = str.normalize().match(RE_NAME);
    this.name = nameMatch ? nameMatch[1] : "anonymous";
  }
}
