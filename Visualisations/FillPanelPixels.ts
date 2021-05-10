import { Color } from "rpi-led-matrix";
import { Painter } from "./Painter";
import { performance } from "perf_hooks";

export function FillPanelPixels(
  iterationsNumber: number,
  painter: Painter,
  r: number = 0,
  g: number = 0,
  b: number = 0
) {
  let c = 0;
  console.log("Number of iterations: " + iterationsNumber);
  const start = performance.now();
  var color: Color;
  while (c < iterationsNumber) {
    if (r != 0 || g != 0 || b != 0) {
      color = { r: r, g: g, b: b };
    } else {
      color = painter.GetRandomColor();
    }

    const map: Color[][] = painter.CreateArray(32);

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        map[i][j] = color;
      }
    }
    painter.Paint(map);
    painter.Sleep(1000);
    c++;
  }
  const stop = performance.now();
  console.log("Time:" + (stop - start));
}
