const DEAD = "·";
const LIVE = "o";

const RE_NAME = /^\s*#N (.+)/m;
const RE_COMMENT = /^\s*#[cC] (.+)/gm;
const RE_XY_RULE =
  /^\s*x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)\s*(?:,\s*rule\s*=\s*(.+))?/m;

const RE_DATA = /(\d*)([bo$!])/g;
const RE_70_LONG = /.{70}/g;

export class Conway {
  name: string;
  gen: number;
  rule: string;
  comments: string[] = [];
  #state: boolean[][] = [];

  constructor(str: string, gen: number = 1) {
    this.gen = gen;

    const nameMatch = str.match(RE_NAME);
    this.name = nameMatch ? nameMatch[1] : "anonymous";
    const xyrMatch = str.match(RE_XY_RULE)!;
    this.rule = xyrMatch[3];

    for (const [, comment] of str.matchAll(RE_COMMENT))
      this.comments.push(comment);

    const width = Number(xyrMatch[1]);
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

  get RLE() {
    const res: string[] = [];
    let count: number;
    let prev: null | boolean = null;

    const push = (cell: boolean) => {
      res.push(`${count > 1 ? count : ""}${cell ? "o" : "b"}`);
      count = 0;
    };

    this.#state.forEach((row, ri) =>
      row.forEach((cell, ci) => {
        if (prev === null) {
          prev = cell;
          count = 1;
        } else if (prev !== cell) {
          push(prev);
          prev = cell;
          count = 1;
        } else if (prev === cell) {
          count++;
        }

        if (ci === this.x - 1) {
          if (prev) push(prev);
          prev = null;
          res.push(ri === this.y - 1 ? "!" : "$");
        }
      })
    );

    return res.join("").replaceAll(RE_70_LONG, (mm) => mm + "\n");
  }

  #aliveNs(y: number, x: number) {
    let count = 0;

    outer: for (let r = y - 1; r <= y + 1; r++) {
      if (r < 0 || r >= this.y) break;

      for (let c = x - 1; c <= x + 1; c++) {
        if (c >= this.x) continue outer;
        if (c == x) continue;

        if (this.#state[r][c]) count++;
      }
    }

    return count;
  }

  toString() {
    return this.#state
      .map((row) => row.map((cell) => (cell ? LIVE : DEAD)).join(""))
      .join("\n");
  }

  evolve() {
    while (this.gen-- > 0) this.__iter();
  }

  __iter() {
    const toKill = [] as number[][];
    for (let r = 0; r < this.y; r++) {
      for (let c = 0; c < this.x; c++) {
        if (this.#state[r][c]) {
          const neighbors = this.#aliveNs(r, c);
          if (neighbors < 2 || neighbors > 3) toKill.push([r, c]);
        }
      }
    }
    toKill.forEach(([r, c]) => (this.#state[r][c] = false));

    const toPopulate = [] as number[][];
    for (let r = 0; r < this.y; r++) {
      for (let c = 0; c < this.x; c++) {
        if (!this.#state[r][c]) {
          const neighbors = this.#aliveNs(r, c);
          if (neighbors === 3) toPopulate.push([r, c]);
        }
      }
    }
    toPopulate.forEach(([r, c]) => (this.#state[r][c] = true));
  }
}
