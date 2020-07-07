import { Painter } from "./Painter";
import { Color } from "rpi-led-matrix";
import { performance } from "perf_hooks";

let c = 0;
let painter = new Painter();
let iterationsNumber = process.argv[2] ? process.argv[2] : 1000;
console.log("Number of iterations: " + iterationsNumber);
let start = performance.now();
while (true) {
  let color: Color = painter.GetRandomColor();

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
