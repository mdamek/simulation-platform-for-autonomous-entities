import { Color } from "rpi-led-matrix";
import { Painter } from "./Painter";

let death: Color = { r: 0, g: 0, b: 0 };
let alive: Color = { r: 255, g: 0, b: 0 };

function createArray(dim: number) {
  let map: Color[][] = [];
  for (var i = 0; i < dim; i++) {
    map[i] = new Array(dim);
  }
  return map;
}

function fillRandom() {
  for (let j = 0; j < gridHeight; j++) {
    for (let k = 0; k < gridWidth; k++) {
      if (Math.round(Math.random()) === 1) {
        theGrid[j][k] = alive;
      } else {
        theGrid[j][k] = death;
      }
    }
  }
}

function updateGrid() {
  for (var j = 1; j < gridHeight - 1; j++) {
    for (var k = 1; k < gridWidth - 1; k++) {
      var totalCells = 0;
      totalCells += theGrid[j - 1][k - 1] === alive ? 1 : 0;
      totalCells += theGrid[j - 1][k] === alive ? 1 : 0;
      totalCells += theGrid[j - 1][k + 1] === alive ? 1 : 0;

      totalCells += theGrid[j][k - 1] === alive ? 1 : 0;
      totalCells += theGrid[j][k + 1] === alive ? 1 : 0;

      totalCells += theGrid[j + 1][k - 1] === alive ? 1 : 0;
      totalCells += theGrid[j + 1][k] === alive ? 1 : 0;
      totalCells += theGrid[j + 1][k + 1] === alive ? 1 : 0;

      if (theGrid[j][k] === death) {
        switch (totalCells) {
          case 3:
            mirrorGrid[j][k] = alive;
            break;
          default:
            mirrorGrid[j][k] = death;
        }
      } else if (theGrid[j][k] === alive) {
        switch (totalCells) {
          case 0:
          case 1:
            mirrorGrid[j][k] = death;
            break;
          case 2:
          case 3:
            mirrorGrid[j][k] = alive;
            break;
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
            mirrorGrid[j][k] = death;
            break;
          default:
            mirrorGrid[j][k] = death;
        }
      }
    }
  }

  for (var j = 0; j < gridHeight; j++) {
    for (var k = 0; k < gridWidth; k++) {
      theGrid[j][k] = mirrorGrid[j][k];
    }
  }
}

var gridHeight = 32;
var gridWidth = 32;
var theGrid = createArray(gridWidth);
var mirrorGrid = createArray(gridWidth);
let painter = new Painter();
fillRandom();

while (true) {
  painter.Paint(theGrid);
  updateGrid();
  painter.Sleep(200);
}
