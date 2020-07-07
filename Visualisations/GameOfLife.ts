import { Color } from "rpi-led-matrix";
import { Painter } from "./Painter";
import { performance } from "perf_hooks";

function fillRandom() {
  for (let j = 0; j < gridHeight; j++) {
    for (let k = 0; k < gridWidth; k++) {
      if (Math.random() < 0.6) {
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
let painter = new Painter();
let death: Color = { r: 0, g: 0, b: 0 };
let alive: Color = painter.GetRandomColor();
var gridHeight = 32;
var gridWidth = 32;
var theGrid = painter.CreateArray(gridWidth);
var mirrorGrid = painter.CreateArray(gridWidth);
let c = 0;
fillRandom();
let iterationsNumber = process.argv[2] ? process.argv[2] : 1000;
console.log("Number of iterations: " + iterationsNumber);
let start = performance.now();
while (c < iterationsNumber) {
  painter.Paint(theGrid);
  painter.Sleep(200);
  updateGrid();
  c++;
}
let stop = performance.now();
console.log("Time:" + (stop - start));
