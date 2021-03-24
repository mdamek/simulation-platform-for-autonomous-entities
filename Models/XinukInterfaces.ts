import { Color } from "rpi-led-matrix";

export interface XinukIteration {
  iterationNumber: number;
  points: Point[];
}

export interface Point {
  x: number;
  y: number;
  colorRGB: Color;
}
