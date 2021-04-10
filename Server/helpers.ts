import { XinukIteration } from "../Models/XinukInterfaces";
import { Color } from "rpi-led-matrix";
import { performance } from "perf_hooks";

function toColor(num: number): [number, number, number] {
  num >>>= 0;
  var b = num & 0xFF,
    g = (num & 0xFF00) >>> 8,
    r = (num & 0xFF0000) >>> 16;
  return [r, g, b];
}

export function ConvertBodyToXinukIteration(body: any): XinukIteration {
  let iterationNumber: number = body.iteration as number;
  let points: Color[][] = body.points.map((a: any[]) =>
    a.map(c => {
      const colorColection = toColor(c)
      return <Color>{
        r: colorColection[0],
        g: colorColection[1],
        b: colorColection[2]
      }
    }
    ));

  return <XinukIteration>{
    iterationNumber: iterationNumber,
    points: points,
  };
}

export function CalculateFrequency(updatePerformanceFrequency: number, savedTime: number) {
  let now = performance.now();
  let time = ((now - savedTime) / 1000)
  console.log("Frequency: ", Math.round(updatePerformanceFrequency / time * 100) / 100, " Hz")
}
