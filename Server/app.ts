import { CalculateFrequency, ConvertBodyToXinukIteration, CreateMatrixByShape, FillMatrixByShapeAndSmallPieces } from "./helpers";
import express, { Application, Request, Response } from "express";

import { FillPanelPixels } from "../Visualisations/FillPanelPixels";
import { Painter } from "../Visualisations/Painter";
import { PrintOwnText } from "../Visualisations/PrintText";
import { XinukIteration } from "../Models/XinukInterfaces";
import axios from "axios";
import bodyParser from "body-parser";
import { performance } from "perf_hooks";

const PORT = 8000;

let savedTime: number;
let requestsNumber: number = 0;

const app: Application = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const painter = new Painter();

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
} );

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

app.get("/clearPixelsState", (req: Request, res: Response) => {
  painter.ClearPixelsState();
  res.sendStatus(200);
});

app.get("/pixelsGlobal/:shape", (req: Request, res: Response) => {
  let shape: string = req.params["shape"];

  let nodeIp1: string = "192.168.1.87";
  let nodeIp2: string = "192.168.1.172";
  let nodeIp3: string = "192.168.1.205";
  let nodeIp4: string = "192.168.1.196";

  let finalMatrix = CreateMatrixByShape(shape);

  axios.all([
    axios.get<number[][]>(`http://${nodeIp1}:${PORT}/pixelsLocal`),
    axios.get<number[][]>(`http://${nodeIp2}:${PORT}/pixelsLocal`),
    axios.get<number[][]>(`http://${nodeIp3}:${PORT}/pixelsLocal`),
    axios.get<number[][]>(`http://${nodeIp4}:${PORT}/pixelsLocal`),
  ]).then(axios.spread((response1: { data: any; }, response2: { data: any; }, response3: { data: any; }, response4: { data: any; }) => {
    let node1Data = response1.data;
    let node2Data = response2.data;
    let node3Data = response3.data;
    let node4Data = response4.data;
    finalMatrix = FillMatrixByShapeAndSmallPieces(shape, finalMatrix, node1Data, node2Data, node3Data, node4Data)
    res.status(200).json(finalMatrix);
  }
  )).catch((error: any) => {
    console.log(error);
    res.sendStatus(500).send("Internal error");
  });

});

app.get("/pixelsLocal", (req: Request, res: Response) => {
  const localState = painter.GetPixelsState();
  res.status(200).json(localState)
});

app.post("/xinukIteration", (req: Request, res: Response) => {
  const xinukIteration: XinukIteration = ConvertBodyToXinukIteration(req.body);
  painter.Paint(xinukIteration.points);
  const updatePerformanceFrequency = 15;
  if (requestsNumber % updatePerformanceFrequency == 0) {
    if (requestsNumber != 0) {
      CalculateFrequency(updatePerformanceFrequency, savedTime);
    }
    savedTime = performance.now();
  }
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
});
