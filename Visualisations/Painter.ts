import * as Jimp from "jimp";

import { Color, Font, LedMatrix, LedMatrixInstance } from "rpi-led-matrix";
import { HexToRgb, getByValue, rgbToHex } from "../Server/helpers";
import { matrixOptions, runtimeOptions } from "./_config";

function findDim(a: any[][]) {
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
    tempArray.push(myChunk);
  }

  return tempArray;
}

export class Painter {
  matrix: LedMatrixInstance;
  color: Color;
  avaliableColors: Map<string, Color>;
  pixelsState: Color[][];
  brightness: number = 50;
  constructor() {
    this.color = { r: 0, g: 0, b: 0 };
    this.matrix = new LedMatrix(matrixOptions, runtimeOptions);
    this.avaliableColors = new Map();
    this.pixelsState = [];
    for (let i = 0; i < this.matrix.width(); i++) {
      this.pixelsState[i] = new Array(this.matrix.height());
    }
    for (let i = 0; i < this.matrix.width(); i++) {
      for (let j = 0; j < this.matrix.height(); j++) {
        this.pixelsState[i][j] = { r: 0, g: 0, b: 0 };
      }
    }
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
          .brightness(this.brightness)
          .fgColor(colorMap[i][j] ? colorMap[i][j] : { r: 0, g: 0, b: 0 })
          .setPixel(j, i);
      }
    }
    this.matrix.sync();
  }

  SetColor(color: string): void {
    let newColor = HexToRgb(color);
    if (Array.from(this.avaliableColors.values()).includes(newColor)) {
      this.color = newColor;
    } else {
      console.log("Color " + color + " is not avaliable")
    }
  }

  SetAvaliableColors(colors: any[]): void {
    this.avaliableColors.clear()
    for (let color of colors) {
      let key = String(Object.keys(color)[0])
      let hexColor = String(Object.values(color)[0])
      let newColor = HexToRgb(hexColor);
      this.avaliableColors.set(key, newColor);
    }
  }

  ClearPixelsState(): void {
    for (let i = 0; i < this.matrix.width(); i++) {
      for (let j = 0; j < this.matrix.height(); j++) {
        this.pixelsState[i][j] = { r: 0, g: 0, b: 0 };
      }
    }
  }

  GetPixelsState(): string[][] {
    let tmpPixlesState: string[][] = [];
    for (let i = 0; i < this.matrix.width(); i++) {
      tmpPixlesState[i] = new Array(this.matrix.height());
    }
    for (let i = 0; i < this.matrix.width(); i++) {
      for (let j = 0; j < this.matrix.height(); j++) {
        let rgbColor = this.pixelsState[i][j]
        let hexColor = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b)
        let typeToPaint = getByValue(this.avaliableColors, hexColor)  
        tmpPixlesState[j][i] = typeToPaint;
      }
    }
    return tmpPixlesState;
  }

  PaintPixel(x: number, y: number): void {
    this.pixelsState[y][x] = this.color;
    this.PaintByOccurrencesMatrix(this.pixelsState);
  }

  PaintByOccurrencesMatrix(matrix: Color[][]): void {
    this.matrix.clear();
    for (let i = 0; i < this.matrix.width(); i++) {
      for (let j = 0; j < this.matrix.height(); j++) {
        if (matrix[i][j] != { r: 0, g: 0, b: 0 }) {
          this.matrix.brightness(this.brightness).fgColor(matrix[i][j]).setPixel(j, i);
        }
      }
    }
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
