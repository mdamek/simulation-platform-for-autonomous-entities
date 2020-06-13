import { Painter } from "./Painter";
import { Color } from "rpi-led-matrix";

function getRndInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}
let c = 0;
let painter = new Painter();

while (c < 5) {
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
    }
  }

  c++;
}
