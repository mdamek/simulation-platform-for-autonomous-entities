import { Painter } from "./Painter";
import { Color } from "rpi-led-matrix";
import { performance } from "perf_hooks";

function getRndInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}
let c = 0;
let painter = new Painter();
let iterationsNumber = process.argv[2] ? process.argv[2] : 1000;
console.log("Number of iterations: " + iterationsNumber);
let start = performance.now();
while (true) {
  let color: Color = {
    r: getRndInteger(0, 255),
    g: getRndInteger(0, 255),
    b: getRndInteger(0, 255),
  };

  let map: Color[][] = painter.CreateArray(32);
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      map = painter.CreateArray(32);
      map[i][j] = color;
      painter.Paint(map);
      if (c == iterationsNumber) {
        let stop = performance.now();
        console.log("Time:" + (stop - start));
        process.exit(0);
      }
      c++;
    }
  }
}
