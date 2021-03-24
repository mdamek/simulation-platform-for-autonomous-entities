import { LedMatrix, LedMatrixInstance, Color, Font } from "rpi-led-matrix";
import { matrixOptions, runtimeOptions } from "./_config";
import * as Jimp from "jimp";
import { XinukIteration } from "../Models/XinukInterfaces";

function findDim(a: Color[][]) {
  let mainLen = a.length;
  let subLen = a[0].length;

  for (let i = 0; i < mainLen; i++) {
    let len = a[i].length;
    subLen = len < subLen ? len : subLen;
  }

  return [mainLen, subLen];
}
function chunkArray(myArray: string, chunk_size: number) {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    let myChunk = myArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }

  return tempArray;
}

export class Painter {
  matrix: LedMatrixInstance;
  constructor() {
    this.matrix = new LedMatrix(matrixOptions, runtimeOptions);
  }

  CreateArray(dim: number): Color[][] {
    let map: Color[][] = [];
    for (var i = 0; i < dim; i++) {
      map[i] = new Array(dim);
    }
    return map;
  }

  Sleep(millis: number) {
    let date = Date.now();
    let curDate = null;
    do {
      curDate = Date.now();
    } while (curDate - date < millis);
  }

  GetRandomColor(): Color {
    function getRndInteger(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min)) + min;
    }
    return {
      r: getRndInteger(0, 255),
      g: getRndInteger(0, 255),
      b: getRndInteger(0, 255),
    };
  }

  Paint(colorMap: Array<Array<Color>>): void {
    let dimensions = findDim(colorMap);
    if (
      dimensions[0] < this.matrix.width() ||
      dimensions[1] < this.matrix.height()
    ) {
      throw new Error(
        "Cannot paint " +
          dimensions +
          " on " +
          [this.matrix.width(), this.matrix.height()]
      );
    }

    for (let i = 0; i < this.matrix.width(); i++) {
      for (let j = 0; j < this.matrix.height(); j++) {
        this.matrix
          .fgColor(colorMap[i][j] ? colorMap[i][j] : { r: 0, g: 0, b: 0 })
          .setPixel(j, i);
      }
    }
    this.matrix.sync();
  }

  PaintPixel(x: number, y: number): void {
    this.matrix.fgColor({ r: 255, g: 0, b: 0 }).setPixel(x, y);
    this.matrix.sync();
    this.Sleep(1500);
    this.Clear();
  }

  PaintXinukIteration(iteration: XinukIteration): void {
    iteration.points.forEach((p) => {
      this.matrix.fgColor(p.colorRGB).setPixel(p.x, p.y);
    });
    console.log("Iteration: ", iteration.iterationNumber);
    this.matrix.sync();
  }

  Clear(): void {
    this.matrix.sync();
    this.matrix.clear();
    this.matrix.sync();
  }

  PrintString(text: string): void {
    const font = new Font(
      "helvR12",
      `${process.cwd()}/Visualisations/fonts/helvR12.bdf`
    );
    this.matrix.font(font);
    const textWidth = font.stringWidth(text);
    let stringsArray = chunkArray(text, 14);
    this.matrix.fgColor(this.GetRandomColor()).clear();
    for (let i = this.matrix.width(); i > -textWidth; i--) {
      let move = 0;
      for (let j = 0; j < stringsArray.length; j++) {
        move += j === 0 ? i : font.stringWidth(stringsArray[j - 1]);
        this.matrix.drawText(
          stringsArray[j],
          move,
          (this.matrix.height() - font.height()) / 2
        );
      }
      this.matrix.sync();
      this.Sleep(20);
      this.matrix.clear();
    }
  }

  async ShowImage(image: string, displayTime: number) {
    let array = this.CreateArray(this.matrix.width());
    await Jimp.read(image).then((result) => {
      result.resize(this.matrix.width(), this.matrix.height());
      for (let i = 0; i < this.matrix.width(); i++) {
        for (let j = 0; j < this.matrix.height(); j++) {
          let pixel = result.getPixelColor(j, i);
          let rgba = Jimp.intToRGBA(pixel);
          let color: Color = { r: rgba.r, g: rgba.g, b: rgba.b };
          array[i][j] = color;
        }
      }
      this.Paint(array);
      this.Sleep(displayTime);
      this.matrix.clear();
    });
  }
}
