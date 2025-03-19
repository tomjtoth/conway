const DEAD = "·";
const LIVE = "o";

const RE_NAME = /^\s*#N (.+)/m;
const RE_XY_RULE =
  /^\s*x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)\s*(?:,\s*rule\s*=\s*(.+))?/m;

const RE_DATA = /(\d*)([bo$!])/g;

export class Conway {
  name: string;
  gen: number;
  rule: string;
  #state: boolean[][] = [];

  constructor(str: string, gen: number = 1) {
    this.gen = gen;

    const nameMatch = str.match(RE_NAME);
    this.name = nameMatch ? nameMatch[1] : "anonymous";
    const xyrMatch = str.match(RE_XY_RULE)!;
    this.rule = xyrMatch[3];

    const width = Number(xyrMatch[1]);
    // const height = Number(xyrMatch[2]);
    let row: boolean[] = [];

    const finishLine = (() => {
      while (row.length < width) row.push(false);
      this.#state.push([...row]);
    }).bind(this);

    outer: for (const [, strQty, char] of str
      .slice(xyrMatch.index! + xyrMatch[0].length)
      .matchAll(RE_DATA)) {
      let qty = Number(strQty == "" ? "1" : strQty);

      switch (char) {
        case "b":
          while (qty-- > 0) row.push(false);
          break;

        case "o":
          while (qty-- > 0) row.push(true);
          break;

        case "$":
          finishLine();
          row = [];
          break;

        case "!":
          finishLine();
          break outer;
      }
    }
  }

  get x() {
    return this.#state[0].length;
  }

  get y() {
    return this.#state.length;
  }

  toString() {
    return this.#state
      .map((row) => row.map((cell) => (cell ? LIVE : DEAD)).join(""))
      .join("\n");
  }

  evolve() {
    while (this.gen-- > 0) this.__iter();
  }

  __iter() {}
}
