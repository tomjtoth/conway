import { describe, test } from "vitest";
import { expect } from "chai";
import { spy } from "sinon";

import { Conway } from "./conway";

const RE_WHITESPACE = /\s+/g;
export const GOSPER = `
  #N Gosper glider gun
  #C This was the first gun discovered.
  #C As its name suggests, it was discovered by Bill Gosper.
  x = 36, y = 9, rule = B3/S23
  24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4b
  obo$10bo5bo7bo$11bo3bo$12b2o!
`;

describe("imported text", () => {
  test("has correct name assigned to instance of Conway", () => {
    const patt = new Conway(GOSPER);

    expect(patt.name).to.equal("Gosper glider gun");
  });

  test("comments are extracted", () => {
    const patt = new Conway(GOSPER);
    expect(patt.comments).to.deep.equal([
      "This was the first gun discovered.",
      "As its name suggests, it was discovered by Bill Gosper.",
    ]);
  });

  test("x,y,rule can be retrieved from input", () => {
    const patt = new Conway(GOSPER);

    expect(patt.x).to.equal(36);
    expect(patt.y).to.equal(9);
    expect(patt.rule).to.equal("B3/S23");
  });

  test("processing pattern correctly", () => {
    const patt = new Conway(GOSPER, 0);

    const res = patt.toString();

    expect(res).to.deep.equal(
      `························o···········
       ······················o·o···········
       ············oo······oo············oo
       ···········o···o····oo············oo
       oo········o·····o···oo··············
       oo········o···o·oo····o·o···········
       ··········o·····o·······o···········
       ···········o···o····················
       ············oo······················`.replaceAll(" ", "")
    );
  });

  test("number of generations can be passed to constructor and retrieved", () => {
    const patt = new Conway(GOSPER, 2);
    expect(patt.gen).to.equal(2);
  });

  test("Conway.__iter() gets called as many times as generation", () => {
    const patt = new Conway(GOSPER, 5);
    const iterMethod = spy(patt, "__iter");
    patt.evolve();
    expect(iterMethod.callCount).to.equal(5);
  });

  test("pattern can be converted back to RLE format", () => {
    const patt = new Conway(GOSPER, 5);

    expect(patt.RLE).to.equal(
      `24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4b
      obo$10bo5bo7bo$11bo3bo$12b2o!`.replaceAll(" ", "")
    );
  });

  // below data retrieved from: https://conwaylife.com/
  test("after n iterations RLE is as expected", () => {
    for (const [rle, gen] of [
      [
        `22b2o$24bo$11b2o12bo8b2o$11b2o4bo7bo8b2o$2o6b2o5b2o8bo$2o5b3o5bo2b2o4b
        o$8b2o6b5ob2o$11b2o4bo$11b2o!`,
        5,
      ],
      [
        `23b2o$23b2o$10bo4bo10b2o6b2o$8bobo4bo10b3o5b2o$2o4b2o7bo10b2o$2o4b2o11b
      2o2b2o$6b2o8b2o2bo2b2o$8bobo5b4o$10bo7bo!`,
        10,
      ],
      [
        `27bo$26b4o$9b2o14b2obobo3b2o$bo7bo2bo11b3obo2bo2b2o$o3b2o7bo11b2obobo
        $o5bo6bo12b4o$b5o7bo7bo5bo$9bo2bo9bo$9b2o9b3o!`,
        19,
      ],

      // based on discussion on Discord, any pixel outside the original matrix is dead
      // [
      //   `26b2o$25bo3bo$9b2o13bo5bo3b2o$9b2o13bo3bob2o2b2o$2o3bo6b2o10bo5bo$obo
      // 3bo5b3o10bo3bo$b5o6b2o12b2o$2b3o4b2o9bobo$9b2o10b2o$21bo!`,
      //   20,
      // ],
      // [
      //   `26b2o$25bo3bo$9b2o13bo5bo3b2o$9b2o13bo3bob2o2b2o$2o3bo6b2o10bo5bo$obo
      // 3bo5b3o10bo3bo$b5o6b2o12b2o$2b3o4b2o9bobo$9b2o10b2o$21bo!`,
      //   50,
      // ],
    ]) {
      const patt = new Conway(GOSPER, gen as number);

      patt.evolve();

      const mine = patt.RLE.replaceAll(RE_WHITESPACE, "");
      const fromWeb = (rle as string).replaceAll(RE_WHITESPACE, "");

      expect(mine).to.equal(fromWeb);
    }
  });
});
