import { describe, test } from "vitest";
import { expect } from "chai";
import { spy } from "sinon";

import { Conway } from "./conway";

const GOSPER = `
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
});
