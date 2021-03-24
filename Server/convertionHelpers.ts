import { XinukIteration, Point } from "../Models/XinukInterfaces";
import { Color } from "rpi-led-matrix";

export function ConvertBodyToXinukIteration(body: any): XinukIteration {
  let iterationNumber: number = body.iteration as number;
  let points: Point[] = body.points.map(
    (p: { x: any; y: any; colorRGB: any }) => {
      return <Point>{
        x: p.x,
        y: p.y,
        colorRGB: <Color>{
          r: p.colorRGB.r,
          g: p.colorRGB.g,
          b: p.colorRGB.b,
        },
      };
    }
  );
  return <XinukIteration>{
    iterationNumber: iterationNumber,
    points: points,
  };
}
