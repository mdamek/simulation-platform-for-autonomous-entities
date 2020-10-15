import { Color } from "rpi-led-matrix";
import { Painter } from "./Painter";
import { performance } from "perf_hooks";

export function GameOfLife(iterationsNumber: number, painter: Painter) {
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
    for (let j = 1; j < gridHeight - 1; j++) {
      for (let k = 1; k < gridWidth - 1; k++) {
        let totalCells = 0;
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

    for (let j = 0; j < gridHeight; j++) {
      for (let k = 0; k < gridWidth; k++) {
        theGrid[j][k] = mirrorGrid[j][k];
      }
    }
  }
  const death: Color = { r: 0, g: 0, b: 0 };
  const alive: Color = painter.GetRandomColor();
  const gridHeight = 32;
  const gridWidth = 32;
  const theGrid = painter.CreateArray(gridWidth);
  const mirrorGrid = painter.CreateArray(gridWidth);
  let c = 0;
  fillRandom();
  console.log("Number of iterations: " + iterationsNumber);
  const start = performance.now();
  while (c < iterationsNumber) {
    painter.Paint(theGrid);
    painter.Sleep(200);
    updateGrid();
    c++;
  }
  const stop = performance.now();
  console.log("Time:" + (stop - start));
}
