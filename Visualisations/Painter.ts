import { LedMatrix, LedMatrixInstance, Color, Font } from "rpi-led-matrix";
import { matrixOptions, runtimeOptions } from "./_config";
import * as Jimp from "jimp";

function findDim(a: Color[][]) {
  const mainLen = a.length;
  let subLen = a[0].length;

  for (let i = 0; i < mainLen; i++) {
    const len = a[i].length;
    subLen = len < subLen ? len : subLen;
  }

  return [mainLen, subLen];
}
function chunkArray(myArray: string, chunk_size: number) {
  let index = 0;
  const arrayLength = myArray.length;
  const tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    const myChunk = myArray.slice(index, index + chunk_size);
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
    const map: Color[][] = [];
    for (let i = 0; i < dim; i++) {
      map[i] = new Array(dim);
    }
    return map;
  }

  Sleep(millis: number) {
    const date = Date.now();
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

  Paint(colorMap: Color[][]): void {
    const dimensions = findDim(colorMap);
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

  PrintString(text: string): void {
    const font = new Font("helvR12", `${process.cwd()}/fonts/helvR12.bdf`);
    this.matrix.font(font);
    const textWidth = font.stringWidth(text);
    const stringsArray = chunkArray(text, 14);
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
    const array = this.CreateArray(this.matrix.width());
    await Jimp.read(image).then((result) => {
      result.resize(this.matrix.width(), this.matrix.height());
      for (let i = 0; i < this.matrix.width(); i++) {
        for (let j = 0; j < this.matrix.height(); j++) {
          const pixel = result.getPixelColor(j, i);
          const rgba = Jimp.intToRGBA(pixel);
          const color: Color = { r: rgba.r, g: rgba.g, b: rgba.b };
          array[i][j] = color;
        }
      }
      this.Paint(array);
      this.Sleep(displayTime);
      this.matrix.clear();
    });
  }
}
