import express, { Application, Request, Response } from "express";

import {
  ConvertBodyToXinukIteration,
} from "./helpers";
import { FillPanelPixels } from "../Visualisations/FillPanelPixels";
import { Painter } from "../Visualisations/Painter";
import { PrintOwnText } from "../Visualisations/PrintText";
import { XinukIteration } from "../Models/XinukInterfaces";
import axios from "axios";
import bodyParser from "body-parser";
import fs from 'fs';
import { performance } from "perf_hooks";

const PORT = 8000;

let savedTime: number;
let startSimulationTime: number;
let requestsNumber: number = 0;
const updatePerformanceFrequency = 5;

const app: Application = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const painter = new Painter();

let nodes: string[] = [];
let xNodes: number = 0;
let yNodes: number = 0;
let panelWidth: number = 0;
let panelHeight: number = 0;

app.get("/test", (req: Request, res: Response) => {
  FillPanelPixels(5, painter);
  painter.Clear();
  res.sendStatus(200);
});

app.get("/fillPanel/:r/:g/:b", (req: Request, res: Response) => {
  let r: number = +req.params["r"];
  let g: number = +req.params["g"];
  let b: number = +req.params["b"];
  FillPanelPixels(5, painter, r, g, b);
  res.sendStatus(200);
});

app.get("/text/:text", (req: Request, res: Response) => {
  let text: string = req.params["text"];
  PrintOwnText(painter, text);
  painter.Clear();
  res.sendStatus(200);
});

app.get("/paintPixel/:x/:y", (req: Request, res: Response) => {
  let x: number = +req.params["x"];
  let y: number = +req.params["y"];
  painter.PaintPixel(x, y);
  res.sendStatus(200);
});

app.get("/clearPixelsState", (_req: Request, res: Response) => {
  painter.ClearPixelsState();
  res.sendStatus(200);
});

app.post("/configureDrawing", (req: Request, res: Response) => {
  nodes = req.body["nodes"];
  xNodes = req.body["xNodes"];
  yNodes = req.body["yNodes"];
  panelWidth = req.body["panelWidth"];
  panelHeight = req.body["panelHeight"];
  console.log("Nodes: ", nodes);
  console.log("xNodes: ", xNodes);
  console.log("yNodes: ",yNodes);
  console.log("panelWidth: ", panelWidth);
  console.log("panelHeight: ", panelHeight);
  painter.ClearPixelsState();
  painter.Clear();
  painter.SetAvaliableColors(req.body["avaliableColors"]);
  res.sendStatus(200);
});

app.get("/setColor/:color", (req: Request, res: Response) => {
  let color: string = req.params["color"];
  color = "#" + color;
  painter.SetColor(color);
  res.sendStatus(200);
});

app.get("/pixelsGlobal", async (req: Request, res: Response) => {

  let finalArray: string[][] = [];
  for (let r = 0; r < panelWidth * yNodes; r++) {
    finalArray[r] = new Array(panelHeight * yNodes );
  }

  let indexOfNode = 0;

  for (let x = 0; x < xNodes; x++) {
    for (let y = 0; y < yNodes; y++) {
      let node = nodes[indexOfNode];
      indexOfNode++;
      await axios
        .get<string[][]>(`http://${node}:${PORT}/pixelsLocal`)
        .then((response: { data: string[][], status: number }) => {
          console.log("Status code: ", response.status)
          console.log("Host: ", node)
          let responseMatrix = response.data;
          console.log(
            "x: ",
            x,
            "y: ",
            y
          );
          for (let i = 0; i < responseMatrix.length; i++) {
            for (let j = 0; j < responseMatrix[0].length; j++) {
              let xIndex = j + (panelWidth * x)
              let yIndex = i + (panelHeight * y)
              finalArray[yIndex][xIndex] = responseMatrix[i][j];
            }
          }
        })
        .catch((err: any) => {
          console.log(err)
        });
    }
  }

  res.status(200).json(finalArray);
});

app.get("/pixelsLocal", (req: Request, res: Response) => {
  const localState = painter.GetPixelsState();
  res.status(200).json(localState);
});

app.post("/xinukIteration", (req: Request, res: Response) => {
  if (requestsNumber == 0){
    console.log('Current directory: ' + process.cwd());
    startSimulationTime = performance.now();
  }
  const xinukIteration: XinukIteration = ConvertBodyToXinukIteration(req.body);
  painter.Paint(xinukIteration.points);

  if (requestsNumber % updatePerformanceFrequency == 0) {
    if (requestsNumber != 0) {
      var stream = fs.createWriteStream("frequency.txt", {mode: 0o777, flags:'a'});
      let now = performance.now();
      let time = ((now - savedTime) / 1000)
      let freq = Math.round(updatePerformanceFrequency / time * 100) / 100
      console.log("Frequency: ", freq, " Hz")
      stream.write(requestsNumber + "," + freq + "\n")
      stream.end();
    }
    savedTime = performance.now();
  }
  
  console.log("Iteration number: ",  xinukIteration.iterationNumber)
  console.log("Time total: ", (performance.now() - startSimulationTime) / 1000)
  requestsNumber++;
  res.sendStatus(200);
});

app.get("/clear", (req: Request, res: Response) => {
  painter.Clear();
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  painter.PrintString("LED server is ready");
  fs.writeFile('frequency.txt', '', function(){console.log('done')});
});
