import { readFileSync } from "fs";

import { Conway } from "./conway";

export function main() {
  const [filePath, gen] = process.argv.slice(2);

  const pattern = new Conway(
    readFileSync(filePath, { encoding: "utf-8" }).toString(),
    Number(gen)
  );

  pattern.evolve();

  console.log(pattern.RLE);
}
