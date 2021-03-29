import { Color } from "rpi-led-matrix";

export interface XinukIteration {
  iterationNumber: number;
  points: Color[][];
}

export interface Point {
  x: number;
  y: number;
  colorRGB: Color;
}
