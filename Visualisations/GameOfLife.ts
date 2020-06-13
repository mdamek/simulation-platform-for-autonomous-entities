import { Color } from "rpi-led-matrix";
import { Painter } from "./Painter";


let death : Color = {r:0, g:0, b:0};
let alive : Color = {r:255, g:0, b:0}; 

function createArray(dim: number) { //creates a 2 dimensional array of required height
    let map : Color[][] = [];
    for (var i=0; i < dim; i++) {
      map[i] = new Array(dim);
    }
    return map;
    }

function fillRandom() { //fill the grid randomly
    for (let j = 0; j < gridHeight; j++) { //iterate through rows
        for (let k = 0; k < gridWidth; k++) { //iterate through columns
            if (Math.round(Math.random()) === 1) {
                theGrid[j][k] = alive;
            } else {
                theGrid[j][k] = death;
            }
        }
    }
}



function updateGrid() {
    //perform one iteration of grid update
    for (var j = 1; j < gridHeight - 1; j++) { //iterate through rows
        for (var k = 1; k < gridWidth - 1; k++) { //iterate through columns
            var totalCells = 0;
            //add up the total values for the surrounding cells
            totalCells += theGrid[j - 1][k - 1] === alive ? 1 : 0; //top left
            totalCells += theGrid[j - 1][k] === alive ? 1 : 0; //top center
            totalCells += theGrid[j - 1][k + 1] === alive ? 1 : 0; //top right

            totalCells += theGrid[j][k - 1] === alive ? 1 : 0; //middle left
            totalCells += theGrid[j][k + 1] === alive ? 1 : 0; //middle right

            totalCells += theGrid[j + 1][k - 1] === alive ? 1 : 0; //bottom left
            totalCells += theGrid[j + 1][k] === alive ? 1 : 0; //bottom center
            totalCells += theGrid[j + 1][k + 1] === alive ? 1 : 0; //bottom right


            //apply the rules to each cell
            if (theGrid[j][k] === death) {
                switch (totalCells) {
                    case 3:
                        mirrorGrid[j][k] = alive; //if cell is dead and has 3 neighbours, switch it on
                        break;
                    default:
                        mirrorGrid[j][k] = death; //otherwise leave it dead
                }
            } else if (theGrid[j][k] === alive) { //apply rules to living cell
                switch (totalCells) {
                    case 0:
                    case 1:
                        mirrorGrid[j][k] = death; //die of lonelines
                        break;
                    case 2:
                    case 3:
                        mirrorGrid[j][k] = alive; //carry on living
                        break;
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        mirrorGrid[j][k] = death; //die of overcrowding
                        break;
                    default:
                        mirrorGrid[j][k] = death; //
          
                }

            }
        }
    }

    for (var j = 0; j < gridHeight; j++) { //iterate through rows
        for (var k = 0; k < gridWidth; k++) { //iterate through columns
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
while(true){
    painter.Paint(theGrid);
    updateGrid();
}