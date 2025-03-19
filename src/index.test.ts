import { writeFileSync } from "fs";
import { test } from "vitest";
import { expect } from "chai";
import { spy } from "sinon";

import { GOSPER } from "./conway.test";

import { main } from ".";

writeFileSync("test.rle", GOSPER);

test("via command line arguments", () => {
  process.argv.push("test.rle", "5");
  const consoleLog = spy(console, "log");

  main();

  expect(consoleLog.callCount).to.equal(1);
  expect(consoleLog.firstCall.args).to.deep.eq([
    `22b2o$24bo$11b2o12bo8b2o$11b2o4bo7bo8b2o$2o6b2o5b2o8bo$2o5b3o5bo2b2o4b
    o$8b2o6b5ob2o$11b2o4bo$11b2o!`.replaceAll(" ", ""),
  ]);
});
