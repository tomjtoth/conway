const RE_NAME = /^\s*#N (.+)/m;
const RE_XY_RULE =
  /^\s*x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)\s*(?:,\s*rule\s*=\s*(.+))?/m;

export class Conway {
  name: string;
  x: number;
  y: number;
  gen: number;
  rule: string;

  constructor(str: string, gen: number = 1) {
    const nameMatch = str.match(RE_NAME);
    this.name = nameMatch ? nameMatch[1] : "anonymous";
    const [, x, y, rule] = str.match(RE_XY_RULE)!;

    this.x = Number(x);
    this.y = Number(y);
    this.gen = gen;
    this.rule = rule;
  }
}
