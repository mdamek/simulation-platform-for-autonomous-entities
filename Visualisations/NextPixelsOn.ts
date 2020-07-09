import { Painter } from "./Painter";
import { Color } from "rpi-led-matrix";
import { performance } from "perf_hooks";

export function NextPixelsOn(iterationsNumber: number, painter: Painter) {
  let c = 0;
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
          return;
        }
        c++;
      }
    }
  }
}
