import { LedMatrix, LedMatrixInstance, Color } from "rpi-led-matrix";
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
}
