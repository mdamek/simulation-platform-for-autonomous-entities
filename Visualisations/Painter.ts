import { LedMatrix, LedMatrixInstance, Color, Font } from "rpi-led-matrix";
import { matrixOptions, runtimeOptions } from "./_config";

function findDim(a: Color[][]) {
  let mainLen = a.length;
  let subLen = a[0].length;

  for (let i = 0; i < mainLen; i++) {
    let len = a[i].length;
    subLen = len < subLen ? len : subLen;
  }

  return [mainLen, subLen];
}

export class Painter {
  matrix: LedMatrixInstance;
  constructor() {
    this.matrix = new LedMatrix(matrixOptions, runtimeOptions);
  }

  CreateArray(dim: number) {
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
  PrintString(text: string): void {
    const font = new Font("helvR12", `${process.cwd()}/fonts/helvR12.bdf`);
    this.matrix.font(font);
    const textWidth = font.stringWidth(text);
    this.matrix.fgColor(this.GetRandomColor()).clear();
    for (let i = this.matrix.width(); i > -textWidth; i--) {
      this.matrix.drawText(text, i, (this.matrix.height() - font.height()) / 2);
      this.matrix.sync();
      this.Sleep(50);
      this.matrix.clear();
    }
  }
}
