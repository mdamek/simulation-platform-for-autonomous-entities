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

export function HexToRgb(hex : string): Color {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? <Color> {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
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

export function CreateArray(x: number, y: number): number[][] {
  const map: number[][] = [];
  for (let i = 0; i < y; i++) {
    map[i] = new Array(x);
  }
  return map;
}

export function CreateMatrixByShape(shape: string): number[][] {
  let finalMatrix: number[][];
  switch (shape) {
    case "square":
      finalMatrix = CreateArray(64, 64)
      break;
    case "horizontal":
      finalMatrix = CreateArray(128, 32)
      break;
    case "vertical":
      finalMatrix = CreateArray(32, 128)
      break;
    default:
      finalMatrix = CreateArray(64, 64)
  }

  return finalMatrix;
}

export function FillMatrixByShapeAndSmallPieces(shape: string, finalMatrix: number[][], node1Data: number[][], node2Data: number[][], node3Data: number[][], node4Data: number[][]) {
  switch (shape) {
    case "square":
      let shift: number = 32;
      for (let i = 0; i < 64; i++) {
        for (let j = 0; j < 64; j++) {
          let element: number = 0;
          if (i < 32 && j < 32)
            element = node1Data[j][i]
          if (i >= 32 && j < 32)
            element = node2Data[j][i - shift]
          if (i < 32 && j >= 32)
            element = node3Data[j - shift][i]
          if (i >= 32 && j >= 32)
            element = node4Data[j - shift][i - shift]
          finalMatrix[j][i] = element
        }
      }
      break;
    case "horizontal":
      for (let i = 0; i < 128; i++) {
        for (let j = 0; j < 32; j++) {
          let element: number = 0;
          if (i < 32)
            element = node1Data[j][i]
          if (i >= 32 && i < 64)
            element = node2Data[j][i - 32]
          if (i >= 64 && i < 96)
            element = node3Data[j][i - 64]
          if (i >= 96)
            element = node4Data[j][i - 96]
          finalMatrix[j][i] = element
        }
      }
      break;
    case "vertical":
      for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 128; j++) {
          let element: number = 0;
          if (j < 32)
            element = node1Data[j][i]
          if (j >= 32 && j < 64)
            element = node2Data[j - 32][i]
          if (j >= 64 && j < 96)
            element = node3Data[j - 64][i]
          if (j >= 96)
            element = node4Data[j - 96][i]
          finalMatrix[j][i] = element
        }
      }
      break;
    default:
      for (let i = 0; i < 64; i++) {
        for (let j = 0; j < 64; j++) {
          let element: number = 0;
          if (i < 32 && j < 32)
            element = node1Data[j][i]
          if (i >= 32 && j < 32)
            element = node2Data[j][i]
          if (i < 32 && j >= 32)
            element = node3Data[j][i]
          if (i >= 32 && j >= 32)
            element = node4Data[j][i]
          finalMatrix[j][i] = element
        }
      }
  }
  return finalMatrix;
}